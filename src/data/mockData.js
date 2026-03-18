export const categories = [
  { id: 'all', name: 'Toda la Colección' },
  { id: 'remeras', name: 'Remeras' },
  { id: 'bolsos', name: 'Bolsos y Accesorios' },
  { id: 'stickers', name: 'Stickers' }
];

export const products = [
  {
    id: 'p1',
    name: 'Remera Negra Oversized',
    price: 35.00,
    category: 'remeras',
    description: 'Confeccionada con algodón de alto gramaje para una caída estructurada. Diseño minimalista y corte oversized que garantizan comodidad premium y un estilo moderno, impecable y atemporal.',
    images: [
      '/images/Remera%20Negra.jpeg',
      '/images/Remera%20Negra%20B.jpeg',
      '/images/Remera%20Negra%20B%20Cerca.jpeg'
    ],
    colors: [
      { id: 'negro', name: 'Negro", hex: "#1a1a1a' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Remera Marrón Claro',
    price: 35.00,
    category: 'remeras',
    description: 'La remera esencial por excelencia. Algodón premium y silueta cuadrada diseñada para caer perfectamente sin ajustarse al cuerpo. Un básico para cualquier guardarropa minimalista.',
    images: [
      '/images/Remera%20Marron%20Claro.jpeg',
      '/images/Remera%20Marron%20Claro%20H.jpeg',
      '/images/Remera%20Marron%20Claro%20H%20Frente.jpeg'
    ],
    colors: [
      { id: 'marron', name: 'Marrón Claro', hex: '#b59273' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    isFeatured: true
  },
  {
    id: 'p3',
    name: 'Remera Beige Clásica',
    price: 35.00,
    category: 'remeras',
    description: 'Construida en tonos terrosos sutiles. Material ultra-cómodo y transpirable. Silueta relajada para ofrecer un look limpio propio de nuestra filosofía de diseño.',
    images: [
      '/images/Remera%20Beige.jpeg'
    ],
    colors: [
      { id: 'beige', name: 'Beige', hex: '#cfc4b6' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    isFeatured: false
  },
  {
    id: 'p4',
    name: 'Remera Blanca Básica',
    price: 35.00,
    category: 'remeras',
    description: 'Una pieza fundacional que no puede faltar. Blanca, pura, con calce perfecto y resistente, manteniendo la sensación premium lavado tras lavado.',
    images: [
      '/images/Remera%20Blanca%20A.jpeg'
    ],
    colors: [
      { id: 'blanco', name: 'Blanco', hex: '#ffffff' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    isFeatured: false
  },
  {
    id: 'p5',
    name: 'Bolso Premium Holy Drip',
    price: 110.00,
    category: 'bolsos',
    description: 'Lleva todo con estilo. Este bolso está diseñado con materiales ultra-resistentes, cierres de máxima calidad y espacio cuidadosamente distribuido. El balance perfecto entre utilidad y estética minimalista.',
    images: [
      '/images/Bolso.jpeg',
      '/images/bolso%202.jpeg',
      '/images/bolso%203.jpeg',
      '/images/bolso%204.jpeg',
      '/images/Bolso%20y%20ropa.jpeg'
    ],
    colors: [
      { id: 'negro', name: 'Negro', hex: '#1a1a1a' }
    ],
    sizes: ['Único'],
    isNew: true,
    isFeatured: true
  }
];
