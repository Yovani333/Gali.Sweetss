export const WHATSAPP_NUMBER = '526643744222';

export const businessConfig = {
  name: 'Gali Sweets',
  whatsappDisplay: '+52 664 374 4222',
  schedule: {
    label: 'Lun - Sáb: 9:00 a.m. - 7:00 p.m.',
    days: 'Lunes a sábado',
    opens: 9,
    closes: 19,
    closedWeekdays: [0],
  },
  minimumNoticeHours: 24,
  deliveryMethods: [
    { id: 'pickup', label: 'Recolección', note: 'El punto y horario de recolección se confirman por WhatsApp.' },
    { id: 'delivery', label: 'Entrega', note: 'Cobertura, horario y costo de entrega se confirman por WhatsApp.' },
  ],
  paymentMethods: [],
};

export function createWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const directWhatsAppUrl = createWhatsAppUrl('Hola, tengo una pregunta sobre sus productos.');
