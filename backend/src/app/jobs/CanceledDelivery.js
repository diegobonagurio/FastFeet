import Mail from '../../lib/Mail';

class CanceledDelivery {
  get key() {
    return 'CanceledDelivery';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product, date, problem } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cancelamento de Encomenda',
      template: 'canceledDelivery',
      context: {
        deliveryman: deliveryman.name,
        description: problem.description,
        recipient: recipient.name,
        product,
        date,
      },
    });
  }
}

export default new CanceledDelivery();
