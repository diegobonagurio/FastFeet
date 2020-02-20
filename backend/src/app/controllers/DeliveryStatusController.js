import { Op } from 'sequelize';
import * as Yup from 'yup';
import { parseISO, startOfDay, endOfDay, getHours } from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

// import File from '../models/File';

class DeliveryStatusController {
  async index(req, res) {
    /* const { id } = req.params;
    const checkDeliveryman = await Deliveryman.findByPk(id);

    if (!checkDeliveryman) {
      res.status(400).json({ eror: 'The deliveryman does not exists ' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        end_date: null,
        canceled_at: null,
      },
    });
    return res.json(deliveries); */

    const checkDeliverymanExists = await Deliveryman.findOne({
      where: { id: req.body.id },
    });

    if (!checkDeliverymanExists) {
      res.status(400).json({ error: 'This Deliveryman does not exists' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.body.id,
        end_date: null,
        canceled_at: null,
      },
    });
    return res.json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;

    const checkDeliverymanExists = await Deliveryman.findOne({
      where: { id },
    });

    if (!checkDeliverymanExists) {
      res.status(400).json({ error: 'This Deliveryman does not exists' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        end_date: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'path', 'name'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number().when('end_date', (end_date, field) =>
        end_date ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const { deliverymanID, id } = req.params;
    const { start_date } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const parseDate = parseISO(start_date);

    if (!(getHours(parseDate) >= 8 && getHours(parseDate) <= 18)) {
      return res.status(400).json({ error: 'Invalid pickup time' });
    }

    const verifyDeliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanID,
        start_date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
    });

    if (verifyDeliveries.length > 5) {
      return res
        .status(401)
        .json({ error: 'The limit of withdraw is 5 for day!' });
    }

    const updatedDelivery = await delivery.update(req.body);

    return res.json(updatedDelivery);
  }
}

export default new DeliveryStatusController();
