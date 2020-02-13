import Mail from '../../lib/Mail';

class CreateDeliveryMail {
  get key() {
    return 'CreateDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, delivery } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega',
      template: 'createDelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipientName: recipient.name,
        recipientRua: recipient.rua,
        recipientNumero: recipient.numero,
        recipientComplemento: recipient.complemento,
        recipientCidade: recipient.cidade,
        recipientEstado: recipient.estado,
        recipientCEP: recipient.cep,
      },
    });
  }
}

export default new CreateDeliveryMail();
