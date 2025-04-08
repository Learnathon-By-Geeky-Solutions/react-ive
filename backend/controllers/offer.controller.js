import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import User from '../models/users.js';
import Application from '../models/applications.js';
import Offer from '../models/offers.js';

const generateOfferLetter = async (jobSeeker, company, jobPost) => {
  return new Promise((resolve, reject) => {
      try {
          const uploadsFolder = path.join(__dirname, '../middlewares/uploads');
          if (!fs.existsSync(uploadsFolder)) {
              fs.mkdirSync(uploadsFolder, { recursive: true });
          }

          const fileName = `offer_letter_${Date.now()}.pdf`;
          const filePath = path.join(uploadsFolder, fileName);
          const doc = new PDFDocument();
          const stream = fs.createWriteStream(filePath);
          doc.pipe(stream);

          // Company Name and Date
          doc.fontSize(14).text(company.name, { align: 'left' });
          doc.fontSize(12).text(new Date().toDateString(), { align: 'left' });
          doc.moveDown();
          
          // Subject
          doc.fontSize(14).text(`Subject: Employment offer from ${company.name}`, { align: 'left' });
          doc.moveDown();
          
          // Salutation
          doc.fontSize(12).text(`Dear ${jobSeeker.name},`, { align: 'left' });
          doc.moveDown();
          
          // Offer Details
          doc.fontSize(12).text(`We are pleased to offer you the position of ${jobPost.position} at ${company.name}.`, { align: 'left' });
          doc.moveDown();
          
          doc.fontSize(12).text(`Your annual cost to company is ₹ ${jobPost.salary}.`, { align: 'left' });
          doc.moveDown();
          
          // Acceptance Instructions
          doc.fontSize(12).text(`If you choose to accept this job offer, please sign and return this letter by ${company.email}.`, { align: 'left' });
          doc.moveDown();
          
          // Closing
          doc.fontSize(12).text(`We are confident that you will find this offer exciting.`, { align: 'left' });
          doc.moveDown(2);
          
          doc.fontSize(12).text('Sincerely,', { align: 'left' });
          doc.fontSize(12).text("HR", { align: 'left' });
          doc.fontSize(12).text(company.name, { align: 'left' });

          doc.end();
          
          stream.on('finish', () => {
              resolve(`middlewares/uploads/${fileName}`);
          });

          stream.on('error', (err) => {
              reject(err);
          });

      } catch (err) {
          reject(err);
      }
  });
};

export const sendOfferLetter = async (req, res) => {
    try {
        const { jobSeekerId, companyId, status, applicationId } = req.body;

        if (!jobSeekerId || !companyId || !status || !applicationId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const jobSeeker = await User.findById(jobSeekerId);
        const company = await User.findById(companyId);
        const application = await Application.findById(applicationId).populate('jobPost');

        if (!jobSeeker || !company || !application) {
            return res.status(404).json({ message: 'Invalid JobSeeker, Company, or Application' });
        }

        // Generate PDF Offer Letter
        const offerPath = await generateOfferLetter(jobSeeker, company, application.jobPost);

        // Store Offer in Database
        const offer = await Offer.create({
            jobSeekerId,
            companyId,
            applicationId,
            status,
            offerLetterPath: offerPath
        });

        // Sending Offer Letter via Email
        const mailOptions = {
            from: `"Tution" <${process.env.EMAIL_USER}>`,
            to: jobSeeker.email,
            subject: `Job Offer from ${company.name}`,
            html: `
                <p>Hello ${jobSeeker.name},</p>
                <p>We are pleased to inform you that you have been selected for the position of ${application.jobPost.position} at ${company.name}. Please find attached the official offer letter.</p>
                <p>Congratulations!</p>
                <p>Sincerely,</p>
                <p>${company.name}</p>
            `,
            attachments: [{ filename: `offer_letter_${Date.now()}.pdf`, path: offerPath, contentType: 'application/pdf' }]
        };

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: 'Offer created and email sent successfully', offer });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get Offers
export const getOfferById = async (req, res) => {
  const { jobSeekerId } = req.params;

  try {
    const offers = await Offer.find({ jobSeekerId }).populate('application').populate('company');

    if (!offers.length) {
      return res.status(404).json({ message: "No offers found for this Job Seeker" });
    }

    return res.status(200).json(offers);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Offer Status
export const updateOfferStatus = async (req, res) => {
  const { offerId } = req.params;
  const { status } = req.body;

  try {
    const updatedOffer = await Offer.findByIdAndUpdate(offerId, { status }, { new: true });

    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
