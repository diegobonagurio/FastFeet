import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          include: {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'path', 'name'],
        },
      ],
      attributes: [
        'id',
        'product',
        'deliveryman_id',
        'recipient_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
    });
    return res.json(deliveries);
  }

  /* async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const checkDeliverymanExists = await Delivery.findOne({
      where: { id: deliveryman_id },
    });

    const checkRecipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!(checkDeliverymanExists || checkRecipientExists)) {
      return res
        .status(400)
        .json({ error: 'Deliveryman and Recipient doesnot exists' });
    }

    if (!checkDeliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman doesnot exists' });
    }

    if (!checkRecipientExists) {
      return res.status(400).json({ error: 'Recipient doesnot exists' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    const { id, product } = await delivery.update(req.body);

    return res.json({
      id,
      product,
      deliveryman_id,
      recipient_id,
    });
  } */

  async update(req, res) {
    const idSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await idSchema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      signature_id: Yup.number(),
      product: Yup.string(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const checkDeliverymanExists = await Delivery.findOne({
      where: { id: deliveryman_id },
    });

    if (!checkDeliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const checkRecipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!checkRecipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    const { product } = await delivery.update(req.body);

    return res.json({
      id,
      product,
      deliveryman_id,
      recipient_id,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { deliveryman_id, recipient_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman doesnot exists' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient doesnot exists ' });
    }

    const delivery = await Delivery.create({
      product,
      deliveryman_id,
      recipient_id,
    });
    return res.json(delivery);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryExists = await Delivery.findByPk(id);

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Delivery Not exists ' });
    }

    await Delivery.destroy({ where: { id } });

    return res
      .status(200)
      .json(id)
      .json({ message: 'Apagado' });
  }
}

export default new DeliveryController();
