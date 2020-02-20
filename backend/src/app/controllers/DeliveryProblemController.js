import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import Queue from '../../lib/Queue';
import CanceledDelivery from '../jobs/CanceledDelivery';

class DeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;

    const checkDeliveryExists = await Delivery.findByPk(id);

    if (!checkDeliveryExists) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const problemDelivery = await DeliveryProblem.findAll({
      where: { delivery_id: id },
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'deliveryman_id', 'recipient_id'],
        },
      ],
    });

    return res.json(problemDelivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id } = req.params;
    const { description } = req.body;

    const checkDeliveryExists = await Delivery.findByPk(id);

    if (!checkDeliveryExists) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    const problem = await DeliveryProblem.create({
      description,
      delivery_id: id,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const checkProblemExists = await DeliveryProblem.findByPk(id);

    if (!checkProblemExists) {
      return res
        .status(400)
        .json({ error: 'Does not exists problem for delivery' });
    }

    const delivery = await Delivery.findByPk(checkProblemExists.delivery_id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    delivery.canceled_at = new Date();

    /* const startDate = format(
      delivery.start_date,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Queue.add(CanceledDelivery.key, {
      delivery,
      deliveryman: delivery.deliveryman,
      problem: checkProblemExists,
      startDate,
    });

    return res.status(200).json(); */

    const { deliveryman, recipient, product } = delivery;
    await Queue.add(CanceledDelivery.key, {
      deliveryman,
      problem: checkProblemExists,
      recipient,
      product,
      date: format(delivery.canceled_at, "dd-MMMM-yyyy 'às' H:mm'h'", {
        locale: pt,
      }),
    });

    return res.send();
  }
}

export default new DeliveryProblemController();
