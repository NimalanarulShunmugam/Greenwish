# Greenwish Product Plan

## Product idea

Greenwish is a self-service product for creating personalized, interactive wish pages. Customers choose an occasion, enter personal details and content, preview the result, pay, and receive a private share link for the recipient.

## Occasions

- Birthday
- Anniversary
- Best of luck
- Valentine's Day
- Other personal wishes

## Customer journey

1. A customer discovers Greenwish through an Instagram post, Story, or ad and taps a link to the site. Instagram posts themselves do not host interactive forms.
2. The customer selects an occasion and enters the sender name, recipient name, detailed message, and optional quiz/game content.
3. The customer previews the page and can go back to edit.
4. The customer pays the displayed price.
5. The server verifies payment with the payment provider before publishing.
6. Greenwish displays or emails a private shareable link.

## Birthday MVP

Start with one birthday template and support:

- Sender and recipient names
- A personal message
- Up to five quiz questions, each with three customer-editable options
- One yes/no question with a hidden-YES puzzle
- Customer-provided decoy phrases, for example shared jokes or frequently used expressions
- Optional photos
- Mobile-friendly preview and editing

The existing static birthday site is a recipient-experience prototype. Its content is currently hard-coded in JavaScript; a product version must load each customer's saved content from a backend.

## Suggested architecture

- Frontend: reusable creation form, preview, and recipient page
- Hosting: Vercel or Netlify
- Backend and database: Supabase or Firebase
- Payments: an Indian payment provider suitable for the business, using server-side webhook verification
- Domain: a Greenwish-branded domain
- Repository: GitHub repository named `Greenwish`; keep it private during early development if it contains personal photos or other private assets

Each page needs an unpredictable ID or slug and a status such as `draft`, `pending_payment`, `paid`, `published`, or `expired`. Never publish a page based only on a browser redirect or a customer clicking a confirmation button.

## Build milestones

1. Validate demand with a sample birthday page and an Instagram link.
2. Build the birthday creation form and validate its inputs.
3. Save drafts and render a personalized preview.
4. Allow customers to return from preview and edit their answers.
5. Integrate payment and verify payment server-side.
6. Publish a private share link only after confirmed payment.
7. Test mobile usability, failed and abandoned payments, duplicate webhook events, expiry, and page deletion.
8. Add anniversary, Valentine's Day, and other templates by reusing the same data-driven page renderer.

## Business and privacy checklist

- Define exactly what the purchase includes, page availability, support, refund terms, and final price.
- Enforce promotional price expiry on the server, not only with a browser countdown.
- Do not commit customer messages, credentials, payment secrets, or private page data to the repository.
- Provide a way to delete customer pages and their data.
- Use photos and music only when you have permission to distribute them.
- Confirm payment provider onboarding, fees, settlement, tax, and applicable business requirements before launch.
- Track visits, form completion, payment conversion, support requests, and refunds during the pilot.
