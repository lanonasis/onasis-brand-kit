# Email Signatures

Complete set of email signature assets for LAN Onasis, including HTML templates for various email clients.
**Version: 1.0.1**

## What's Included
- **HTML Template**: email-signature-html.txt (copy-paste ready HTML)
- **Documentation**: README.md

## How to Use
### Setup Instructions
- **Gmail**: Settings → See all settings → Signature → New → Paste HTML
- **Outlook**: File → Options → Mail → Signatures → New → Paste HTML
- **Apple Mail**: Preferences → Signatures → New → Paste HTML

### Example HTML
```html
<!-- See email-signature-html.txt for full version -->
<table style="font-family: Arial, sans-serif; max-width: 400px;">
  <tr><td><img src="https://your-domain.com/logo-secondary.png" alt="Lan Onasis" width="120"></td></tr>
  <tr><td style="color:#1B365D;font-weight:700">[Your Name]</td></tr>
  <tr><td style="color:#666">[Your Title] | Lan Onasis</td></tr>
  <tr><td>📧 [your-email] | 🌐 <a href="https://www.lanonasis.com">www.lanonasis.com</a></td></tr>
</table>
```

## Accessibility Guidelines
- Always provide descriptive alt text for images (e.g., "Lan Onasis logo")
- Ensure sufficient contrast between text and background (minimum 4.5:1 for text)
- Use semantic HTML elements where possible
- Avoid using color alone to convey information
- Test with screen readers to ensure proper reading order
- Provide text alternatives for any decorative elements
- Consider providing a plain text version for users who prefer it
- Ensure links are clearly identifiable and properly labeled

## Notes
- Host images on HTTPS and reference absolute URLs for better client support.
- Avoid external CSS; inline styles are most reliable.
- Use brand colors: Navy #1B365D, Green #00D4AA, Gold #FFD700.
