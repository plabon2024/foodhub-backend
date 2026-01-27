export function verificationEmailTemplate({
  name,
  verifyUrl,
}: {
  name?: string;
  verifyUrl: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email - FoodHub</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0; padding:0; background-color:#f6f6f6; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 24px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#ff7a18; padding:20px; text-align:center;">
              <h1 style="margin:0; color:#ffffff;">FoodHub</h1>
              <p style="margin:4px 0 0; color:#ffe6d1;">
                Discover & Order Delicious Meals
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin-top:0; color:#333;">
                Welcome${name ? `, ${name}` : ""}!
              </h2>

              <p style="color:#555; line-height:1.6;">
                Thanks for signing up for <strong>FoodHub</strong>.
                Please verify your email address to activate your account and start ordering delicious meals from your favorite providers.
              </p>

              <div style="text-align:center; margin:32px 0;">
                <a
                  href="${verifyUrl}"
                  style="
                    background:#ff7a18;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:6px;
                    font-weight:bold;
                    display:inline-block;
                  "
                >
                  Verify Email Address
                </a>
              </div>

              <p style="color:#777; font-size:14px; line-height:1.6;">
                If you didn’t create a FoodHub account, you can safely ignore this email.
              </p>

              <p style="color:#777; font-size:14px;">
                This link will expire for security reasons.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa; padding:16px; text-align:center; font-size:12px; color:#999;">
              © ${new Date().getFullYear()} FoodHub. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
