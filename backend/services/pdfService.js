import PDFDocument from "pdfkit";

const generatePDF = (
customer,
transactions,
res
)=>{

const doc=
new PDFDocument();

res.setHeader(
"Content-Type",
"application/pdf"
);

res.setHeader(
"Content-Disposition",
`attachment; filename=${customer.customerName}.pdf`
);

doc.pipe(res);


// Title

doc.fontSize(20)
.text(
"UdhaarBook Statement",
{
align:"center"
}
);

doc.moveDown();


// Customer Details

doc.fontSize(14)
.text(
`Customer: ${customer.customerName}`
);

doc.text(
`Phone: ${customer.phoneNumber}`
);

doc.text(
`Balance: ₹${customer.currentBalance}`
);

doc.moveDown();


// Transactions

doc.text(
"Transactions"
);

doc.moveDown();

transactions.forEach(
(transaction)=>{

doc.text(

`${transaction.type}
 | ₹${transaction.amount}
 | ${transaction.description}`

);

}
);

doc.end();

};

export default generatePDF;