import nodemailer from "nodemailer";
import handlebars from "express-handlebars";
import path from "path";
import fs from "fs";

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

// Function to render templates with `express-handlebars`
export const renderTemplate = async (
  templateName: string,
  context: object,
): Promise<string> => {
  const templatePath = path.resolve("./src/templates", `${templateName}.hbs`);

  // Read the template file
  const templateSource = fs.readFileSync(templatePath, "utf8");

  // Compile the template
  const hbs = handlebars.create({
    extname: ".hbs",
    layoutsDir: path.resolve("./src/templates/layouts"),
    partialsDir: path.resolve("./src/templates/partials"),
    defaultLayout: false,
  });

  return new Promise<string>((resolve, reject) => {
    hbs.renderView(
      templatePath,
      context as { [key: string]: any }, // Chuyển đổi kiểu context
      (err, renderedTemplate) => {
        if (err) {
          reject(err);
        } else {
          resolve(renderedTemplate || ""); // Đảm bảo giá trị không undefined
        }
      },
    );
  });
};
