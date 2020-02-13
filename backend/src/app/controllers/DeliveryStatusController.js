import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

class DeliveryStatusController {
  async index(req, res) {
    const { id } = req.params;
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
    return res.json(deliveries);
  }
}

export default new DeliveryStatusController();
