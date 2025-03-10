const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false,
	requireTLS: true,
	auth: {
		user: process.env.SMTP_MAIL,
		pass: process.env.SMTP_PASSWORD,
	},
});

const sendMail = (name, email, subject, content, cta, link) => {
	const message = `
	<div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border-radius: 8px; border: 1px solid #e0e0e0; background-color: #ffffff;">
		<!-- Header -->
		<div style="text-align: center; margin-bottom: 25px;">
			<h1 style="color: #5c6ac4; margin: 0; font-size: 24px;">InterviewInsights</h1>
			<p style="color: #666666; margin-top: 5px;">Welcome, ${name}!</p>
		</div>
		
		<!-- Content -->
		<div style="background-color: #f8f6fc; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
			<p style="margin-top: 0; color: #333333;">${content}</p>
		</div>
		
		<!-- Button -->
		<div style="text-align: center; margin: 30px 0;">
			<a href=${link} style="background-color: #6d5cae; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">${cta}</a>
		</div>
		
		<!-- Footer -->
		<div style="text-align: center; color: #888888; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
			<p>Contact us at support@interviewinsights.com</p>
		</div>
	</div>`;
	
	try {
		const mailOptions = {
			from: process.env.SMTP_MAIL,
			to: email,
			subject: subject,
			html: message,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = sendMail;
