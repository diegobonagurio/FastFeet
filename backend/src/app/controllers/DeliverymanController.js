import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const userExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  // async update(req, res) {
  // const schema = Yup.object().shape({
  // name: Yup.string(),
  // rua: Yup.string().required(),
  // numero: Yup.string().required(),
  // complemento: Yup.string(),
  // estado: Yup.string()
  // .required()
  // .max(2),
  // cidade: Yup.string().required(),
  // cep: Yup.string().required(),
  // });
  //
  //  if (!(await schema.isValid(req.body))) {
  //  return res.status(400).json({ error: 'Validation Fails' });
  // }

  // const { id } = req.params;

  // const recipient = await Recipient.findByPk(id);

  // if (!recipient) {
  // return res.json({ error: 'Recipíent does not exist' });
  // }

  // const {
  // name,
  // rua,
  // numero,
  // complemento,
  // estado,
  // cidade,
  // cep,
  // } = recipient.update(req.body);

  // return res.json({
  // id,
  // name,
  // rua,
  // numero,
  // complemento,
  // estado,
  // cidade,
  // cep,
  // });
  // }
}

export default new DeliverymanController();
