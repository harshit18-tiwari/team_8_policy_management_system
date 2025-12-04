const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generatePolicyPDF = (data) => {
    const doc = new PDFDocument();

    // Pipe output to file
    doc.pipe(fs.createWriteStream(data.path));

    // Add content
    doc.fontSize(25).text('Policy Certificate', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Policy Number: ${data.policyNumber}`);
    doc.text(`Holder Name: ${data.holderName}`);
    doc.text(`Product: ${data.productName}`);
    doc.text(`Premium Paid: $${data.premium}`);
    doc.text(`Valid From: ${data.startDate}`);
    doc.text(`Valid Until: ${data.endDate}`);

    doc.moveDown();
    doc.fontSize(10).text('This is a computer-generated document.', { align: 'center' });

    doc.end();
};
