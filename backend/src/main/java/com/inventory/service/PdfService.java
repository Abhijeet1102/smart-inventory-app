package com.inventory.service;

import com.inventory.model.CartItem;
import com.inventory.model.OrderDetails;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Calendar;

@Service
public class PdfService {

    @Value("${inventory.billPath}")
    private String billPath;

    public String generateOrderPdf(OrderDetails orderDetails) throws Exception {
        // Ensure directory exists
        File directory = new File(billPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filePath = billPath + orderDetails.getOrderId() + ".pdf";
        Document doc = new Document();
        
        PdfWriter.getInstance(doc, new FileOutputStream(filePath));
        doc.open();
        
        Paragraph projectName = new Paragraph("                                                        Inventory Management System\n");
        doc.add(projectName);
        Paragraph starLine = new Paragraph("***************************************************************************************************************");
        doc.add(starLine);
        
        SimpleDateFormat myFormat = new SimpleDateFormat("dd-MM-yyyy");
        Calendar cal = Calendar.getInstance();
        
        Paragraph details = new Paragraph("\tOrder ID: " + orderDetails.getOrderId() + "\nDate: " + myFormat.format(cal.getTime()) + "\nTotal Paid: " + orderDetails.getTotalPaid());
        doc.add(details);
        doc.add(starLine);
        
        PdfPTable tb1 = new PdfPTable(5);
        PdfPCell nameCell = new PdfPCell(new Phrase("Name"));
        PdfPCell descriptionCell = new PdfPCell(new Phrase("Description"));
        PdfPCell priceCell = new PdfPCell(new Phrase("Price Per Unit"));
        PdfPCell quantityCell = new PdfPCell(new Phrase("Quantity"));
        PdfPCell subTotalPriceCell = new PdfPCell(new Phrase("Sub Total Price"));

        BaseColor backgroundColor = new BaseColor(255, 204, 51);
        nameCell.setBackgroundColor(backgroundColor);
        descriptionCell.setBackgroundColor(backgroundColor);
        priceCell.setBackgroundColor(backgroundColor);
        quantityCell.setBackgroundColor(backgroundColor);
        subTotalPriceCell.setBackgroundColor(backgroundColor);

        tb1.addCell(nameCell);
        tb1.addCell(descriptionCell);
        tb1.addCell(priceCell);
        tb1.addCell(quantityCell);
        tb1.addCell(subTotalPriceCell);

        if (orderDetails.getCartItems() != null) {
            for (CartItem item : orderDetails.getCartItems()) {
                tb1.addCell(item.getName());
                tb1.addCell(item.getDescription() != null ? item.getDescription() : "");
                tb1.addCell(String.valueOf(item.getPrice()));
                tb1.addCell(String.valueOf(item.getQuantity()));
                tb1.addCell(String.valueOf(item.getSubTotal()));
            }
        }
        
        doc.add(tb1);
        doc.add(starLine);
        Paragraph thanksMsg = new Paragraph("Thank you, Please Visit again");
        doc.add(thanksMsg);
        
        doc.close();
        
        return filePath;
    }
}
