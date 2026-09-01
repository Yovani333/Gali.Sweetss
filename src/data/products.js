import cupcake from '../assets/images/cupcake-vainilla.png';
import rainbowCake from '../assets/images/pastel-arcoiris.png';
import elegantCake from '../assets/images/pastel-elegante.png';
import customCake from '../assets/images/pastel-personalizado.png';

export const products = [
  {
    name: 'Cupcake de Vainilla',
    description: 'Esponjoso cupcake con frosting\nde vainilla y detalles en rosa.',
    price: '$2.50',
    image: cupcake,
    alt: 'Cupcake rosa con vela'
  },
  {
    name: 'Pastel Arcoíris',
    description: 'Pastel multicolor decorado con\ncrema, cerezas y detalles únicos.',
    price: '$45.00',
    image: rainbowCake,
    alt: 'Pastel arcoiris con cerezas'
  },
  {
    name: 'Pastel Elegante',
    description: 'Diseño clásico en tonos rosados,\nideal para celebraciones especiales.',
    price: '$65.00',
    image: elegantCake,
    alt: 'Pastel alto elegante rosa y blanco'
  },
  {
    name: 'Pastel Personalizado',
    description: 'Creamos el diseño que imaginas\npara momentos inolvidables.',
    price: '$50.00',
    image: customCake,
    alt: 'Pastel personalizado con ilustracion decorativa'
  }
];
