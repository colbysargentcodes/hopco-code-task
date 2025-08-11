const hospitalA = {
  id: 1,
  name: 'General Hospital',
  config: {
    inventoryHeaders: {
      fields: ['productName', 'manufacturer', 'category', 'quantity'],
      defaultSort: { key: 'productName', order: 'asc' },
    },
  },
}

const hospitalB = {
  id: 2,
  name: 'City Medical Center',
  config: {
    inventoryHeaders: {
      fields: ['productName', 'category', 'expiryDate', 'quantity', 'manufacturer', 'unitPrice'],
      defaultSort: { key: 'expiryDate', order: 'asc' },
    },
  },
}

export const users = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice.smith@generalhospital.com',
    hospital: hospitalA,
  },
  {
    id: 2,
    name: 'Bob Jones',
    email: 'bob.jones@citymedcenter.org',
    hospital: hospitalB,
  },
]
