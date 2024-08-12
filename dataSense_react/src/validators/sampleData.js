export const rowsData = [];
for (let i = 1; i <= 100; i++) {
  rowsData.push({
    id: i,
    name: `Name ${i}`,
    email: `email${i}@example.com`,
    age: Math.floor(Math.random() * 100),
    country: ["USA", "Canada", "UK", "Australia", "Germany"][
      Math.floor(Math.random() * 5)
    ],
  });
}

export const columnsData = [
  { id: "name", label: "Name", align: "left" },
  { id: "email", label: "Email", align: "left" },
  { id: "age", label: "Age", align: "right" },
  { id: "country", label: "Country", align: "left" },
];
