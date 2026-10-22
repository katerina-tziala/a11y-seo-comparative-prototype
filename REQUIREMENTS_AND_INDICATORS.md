# Requirements and Indicators

This document lists the accessibility requirements of the prototype and the SEO indicators that the evaluation examines. Each accessibility requirement addresses one failure that is present in the baseline, and it is met in the accessibility-governed implementation. The IDs in the tables are the same IDs that appear in commit messages and in the evaluation files.

## Accessibility requirements

| ID | Name | Baseline | Accessibility-governed | What is examined |
| --- | --- | --- | --- | --- |
| CF09 | Informative image without a text alternative | `<img>` without an alt attribute | The same `<img>` with an alt that describes the diagram | The alt of the diagram image, and the name of the image |
| CF10 | Image alt text not equivalent to the image purpose | alt value that is the file name (alt="hero-dashboard.svg") | alt that describes the illustration (a completed website audit) | The alt of the hero image, and the name of the image |
| CF11 | Functional image without a text alternative | `<a>` whose only content is an `<img>` without an alt attribute | The same `<img>` with alt="LucidReach Digital home" | The alt of the logo image, and the name of the logo link |
| CF14 | Visual heading not marked up, or no headings | Section title in a styled `<p>` | Section title in an `<h2>` | The element of the section title, and its role and level |
| CF15 | Heading levels not matching the hierarchy | Card titles in `<h4>` directly under an `<h2>` | Card titles in `<h3>` | The elements of the three card titles, and their heading levels |
| CF16 | Empty or non-descriptive headings or labels | Decorative icon inside an `<h3>` with no text | Decorative icon inside a `<span>`, which is hidden from assistive technologies in both implementations | The element around each benefit icon, and the heading nodes of the benefit items |
| CF17 | Table header cells not exposed | Header cells in `<td>` without scope, and the table title in a `<p>` | Header cells in `<th>` with scope, and the table title in a `<caption>` | The header cells and the title of the Packages table, their roles, and the name of the table |
| CF18 | Lists not marked up, or invalid list markup | List items in `<div>` elements | `<ul>` with `<li>` items | The elements of the feature items, and the list and list item roles |
| CF19 | DOM order not matching the visual order | Source order 03, 01, 04, 02, while CSS shows the steps as 01 to 04 | Source order 01 to 04, without any CSS reordering | The order of the four steps in the DOM, compared with their visual order |
| CF21 | Link without an accessible name | `<a href>` that contains only a decorative `<img alt="">` without a name | Visually hidden text names each link (for example, "LucidReach Digital on LinkedIn"), while the image stays decorative (alt="") and is ignored by assistive technologies | The content of each social link, and the name of each link |
| CF22 | Link text not describing the purpose | The same "Learn more" text for different destinations | Visually hidden text completes each link (for example, "Learn more about accessible web design") | The visible and hidden text of each "Learn more" link, its name, and its programmatically determined context |
| CF23 | Missing or empty page title | No `<title>` element (an empty title is omitted by Nuxt) | Descriptive `<title>` ("Accessible, Search-Ready Websites \| LucidReach Digital") | The `<title>` element, and the name of the document |
| CF27 | Change of context without request or advance information | The link opens a new window without advance information | A visually hidden warning is associated with the link through aria-describedby | The target, rel and aria-describedby of the GitHub link, its description, and that it opens a new tab |
| CF29 | Visible label not associated with its control | Label text in a `<span>` that is not associated with the field | `<label for>` associated with the field | The label elements of Name, Email and Website URL, and the name of each field |
| CF31 | Button without an accessible name | `<button>` that contains only an SVG without a name | Visually hidden text "Toggle navigation" inside the button | The content of the menu toggle, and its name |
| CF32 | Accessible name not containing the visible label | aria-label="Send form" overrides the visible text "Submit request" | No aria-label, so the name comes from the visible text | The aria-label and the visible text of the submit button, and its name |
| CF33 | Input purpose not identified | No autocomplete attributes | autocomplete="name", "email" and "url" | The autocomplete attributes of Name, Email and Website URL |
| CF34 | Missing instructions or grouping in forms | Radio buttons in a `<div>`, with the group label in a `<p>` | `<fieldset>` with `<legend>` | The container and the group label of the Main concern radios, and the group node and its name |
| CF35 | Input errors without identification, description or correction suggestion | Visible error messages identify the error and, where the correction is known, suggest a correction, but they are not programmatically associated with their fields | The same visible error messages, with aria-invalid on each invalid field and aria-describedby linking each field to its message | The visible error messages after an empty submission, and the invalid state and description of each field and radio |
| CF36 | Incorrect or incomplete roles, states or properties | No aria-expanded and no aria-controls | aria-expanded shows the state of the menu, and aria-controls points to the navigation | aria-expanded and aria-controls of the toggle, and its expanded state, with the menu closed and open |
| CF38 | Element that cannot receive keyboard focus | `<div>` with a click handler, without tabindex | `<button type="button">` with aria-expanded and aria-controls | Whether Tab reaches each FAQ question, and whether Enter and Space open it |
| CF39 | Function not available through the keyboard | `<span role="link" tabindex="0">` with a click handler and no key handling | `<a href="#services">` | Whether Enter on the call to action moves to the services section, and its element |
| CF40 | Keyboard trap | Tab cycles inside the open menu, and Escape does not close it | Tab leaves the menu in source order, and Escape closes it and returns focus to the toggle | Where focus goes after each key, with the menu open |
| CF41 | Focus order not preserving meaning | Source order puts “Contact” before “Explore”, while CSS shows “Explore” first | Source order matches the visual order, without any CSS reordering | The focus order through the footer, compared with the visual order of the columns and with the DOM order |
| CF46 | Page language not declared | `<html>` without lang | `<html lang="en">` | The lang attribute of `<html>` |
| CF48 | Language of parts not identified | Quotation without lang | lang="de" on the quotation | The lang attribute of the German quotation, and the language the browser computes for it |

## SEO indicators

The SEO indicators are not changed directly. The evaluation examines whether they differ between the two implementations as a result of the accessibility requirements.

| ID | Name | What is examined |
| --- | --- | --- |
| SI01 | Page title | The text of `<title>` |
| SI02 | Image alternative text | The alt of every `<img>` |
| SI03 | Link text | The text of each link: visible text, alt of a linked image, visually hidden text |
| SI04 | Crawlable links | The `<a href>` elements, and elements that act as links without being `<a>` |
| SI05 | Indexability directives | The robots meta element, the X-Robots-Tag header and robots.txt for Googlebot |
| SI06 | HTTP status | The status of the document request |
| SI07 | Meta description | The content of the meta description |
| SI08 | Canonical URL | The href of the canonical link |
| SI11 | Heading elements | The heading elements, their levels and text |
| SI12 | Viewport meta element | The presence and content of the viewport meta element |
