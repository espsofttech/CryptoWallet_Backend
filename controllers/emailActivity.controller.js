const nodemailer = require("nodemailer");
const config = require("../config");
exports.Activity = async function (
  email,
  subject,
  headerMSG,
  headerMSG1,
  text
) {
  let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user1,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let mailOptions = {
    from: "developer@espsofttech.com",
    to: `${email}`,
    subject: subject,
    html: ` <body>
    <table cellspacing="0" cellpadding="0" width="100%" style="max-width:600px;margin:auto;font-family:Inter,sans-serif;font-size:14px">
    <tbody>
       <tr>
          <td style="padding:15px 35px;text-align:center;background-color:#0052ff;border-radius: 8px;">
             <a href="#m_8849853368158522606_m_8672365594497135802_" style="display:inline-block;margin:0 15px">
             <h1 style="color:white;margin:0px 0px;">Crypto Wallet</h1>
             
             </a>
             
          </td>
       </tr>
       <tr>
        <td style="padding:25px 36px 0px 36px;font:500 0.9rem 'Lato',sans-serif" align="left"><h1>${headerMSG}</h1></td>
       </tr>
       <tr>
          <td style="padding:15px 36px;font:500 0.9rem 'Lato',sans-serif" align="left">
             <p style="margin:0 0 18px;color:#212529;line-height:28px;font-size:16px">Dear ${email}<wbr>,</p>
             <p style="margin:0px;color:#212529;line-height:28px;font-size:16px;word-wrap:break-word">${headerMSG1} </p>
          </td>
       </tr>
       <tr>
       <td style="padding:20px 15px 30px 15px;font:500 0.9rem 'Lato',sans-serif" align="center">
       
         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
         <h4> ${text}</h4>
         </div>
       </td>
       </tr>
       <tr>
     
          <td style="padding:0px 15px 30px 15px;font:500 0.9rem 'Lato',sans-serif" align="center">
             <a href="https://espsofttech.org/crypto-wallet/" style="display:inline-block;font-size:16px;width:60%;padding:16px 0;background:linear-gradient(80deg,#0052ff,#014eef);border-radius:10px;color:#fff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://espsofttech.org/crypto-wallet/&amp;source=gmail&amp;ust=1674038836877000&amp;usg=AOvVaw1rLfQc_yKXaN83SGRH3ePi">Click Here to Explore the Platform</a>
          </td>
       </tr>
       <tr>
          <td style="padding:15px 36px;font:500 0.9rem 'Lato',sans-serif;border-top:1px solid #ddd" align="left">
             <p style="margin-top:10px;color:#212529;line-height:25px;font-size:16px;font-weight:500;text-align:justify">Regards,<br>Team crypto wallet</p>
          </td>
       </tr>
  
       <tr>
          <td style="background:#0052ff;padding:15px;border-radius: 8px;font:500 0.9rem 'Lato',sans-serif" align="center">
             <p style="margin:0;color:#fff">Please reach out to <a href="#m_8849853368158522606_m_8672365594497135802_" style="text-decoration:none;color:#fff">support@cryptowallet.com</a> for any queries</p>
             <font color="#888888">
             </font>
          </td>
       </tr>
    </tbody>
 </table>
        </body>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};
