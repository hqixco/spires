# SP!RES website — site map and implementation brief

This is not a single landing page. It is a multi-page corporate website/catalog for SP!RES.

Use this file as the primary project brief.
Use docs/figma.css as the visual design reference.
Do not use Figma MCP unless absolutely necessary.

## Figma

Reserve Figma link:
https://www.figma.com/design/l4vRMyP1cSz4bxqNKAQYME/Spires--Copy-?node-id=43-2

Figma MCP usage limit:
- Prefer not to use Figma MCP at all.
- Use Figma MCP maximum once.
- Use only the specified node-id.
- Do not inspect the whole Figma file.
- Do not browse other pages, frames, or nodes.

## Project type

Multi-page corporate website/catalog.

## Stack

- Vite
- React
- TypeScript
- React Router
- Plain CSS or CSS Modules
- No Tailwind
- No backend
- No unnecessary UI libraries

## Global layout

Shared across most pages:

- Header
- Footer
- Application/contact form section
- Main content area

Header navigation:
- Technology
- Solutions
- Materials
- Training
- Cases
- Contacts
- Articles

Languages:
- Eng
- Deu

Shared contact data:
- +49 631 20561 100
- info@brawosystems.com

Common buttons:
- Contact us
- Get a consultation
- More detailed
- Watch all
- Show more
- Send
- Go back to the main page

## Design tokens from Figma CSS

Use docs/figma.css as a design specification, not as production CSS.

Use these values as CSS variables:

- background: #FDFEFF
- accent: #FD9D00
- dark blue: #003E60
- light gray: #EBEFF2
- light blue: #DCEDFF
- text: #333333
- muted text: #99A3AA
- white: #FFFFFF / #FFFEFD
- section radius: 20px
- card/button radius: 10px
- main font: Inter
- heading font: Bebas Neue Cyrillic or fallback sans-serif

Do not copy directly from Figma CSS:
- position: absolute for page layout
- left/top coordinates
- huge canvas sizes
- fixed 1920px width as the base layout
- random names like Frame 22 / Frame 117...
- url(...) assets if local files do not exist

Layout rules:
- Desktop max-width: about 1660px
- Use container + responsive padding
- Do not use absolute positioning for the whole page
- Use CSS grid/flex
- On tablet/mobile, sections should stack into one column
- Tables should be responsive and scroll horizontally on mobile
- Missing images should be replaced with PlaceholderImage blocks

## Recommended project structure

- package.json
- index.html
- src/main.tsx
- src/App.tsx
- src/router.tsx
- src/styles/global.css
- src/styles/variables.css
- src/layouts/MainLayout.tsx
- src/components/
- src/sections/
- src/pages/
- src/data/

## Shared components

Create reusable components:

- Header
- Footer
- Button
- SectionLabel
- PageHero
- ApplicationSection
- ContactForm
- Card
- InfoGrid
- ReviewCard
- FAQ
- Breadcrumbs
- PlaceholderImage
- ComparisonTable
- SpecsTable

## Pages and routes

### 1. `/`

Home page sections:
- Hero
- Technology preview
- Advantages
- About company
- Projects preview
- Reviews
- FAQ
- Application
- Footer

Hero text:
A revolutionary technology for sanitation of sewage systems that changes the rules of the game!
Gain an advantage over your competitors with SP!RES!

Technology preview:
[ Technology ]
The system of remote restoration of sewage systems
Our technology allows the repair of pipes with diameters of DN100, DN125 and DN150 at a considerable distance of tens of meters from the point of entry into the main pipeline, even in hard-to-reach places.

Bullets:
- without excavation
- without large financial investments
- without restoration of landscaping
- without access to private property

Advantages:
[ Advantages ]
6 Reasons to Choose SP!RES and reach a New Level

Cards:
1. Long service life with a guarantee
   We use the most modern materials and patented technologies. We guarantee the result
2. Compliance with European ESG standards
   No harm to the soil, green areas and urban environment
3. Customer interest
   Municipalities, city utilities, etc
4. Guaranteed payback
   The investment repayment period is no more than 6 months
5. Proven effectiveness
   More than 3,000 meters of pipes were restored in 2021-2025 alone
6. A patented and certified system
   There are no analogues in the world. It works in any conditions and at any time of the year

About company:
[ About the company ]
SP!RES company

Stats:
- > 3,000 meters
- 10 years
- > 167
- > 650

Projects:
[ Projects ]
Real-world examples of our technologies

Reviews:
[ Reviews ]
Honest feedback from our customers

FAQ:
[ FAQ ]
Frequently Asked Questions
Question: What is the warranty period?

### 2. `/technology`

Technology page sections:
- Main Technology
- Stages
- Conditions
- Compatibility
- Certificates
- Comparison
- Application

Main:
[ Main Technology ]
The system of remote restoration of sewage systems

Intro:
A remote controlled recovery system for pipes with a diameter of DN100-150 at a distance of up to tens of meters from the entry point.
Forget about dismantling, approving, and restoring landscaping.

Stages:
[ Stages ]
Process technology: from the input to the finished pipe

Stages list:
1. Preparation and broaching
2. Orientation and inversion
3. Polymerization
4. Monitoring and completion

Conditions:
[ Conditions ]
Working conditions and technical capabilities

Condition cards:
- Working environment
- Service life
- Temperature regime
- Pipe type

Compatibility:
[ Compatibility ]
What diameters do we work with?

Cards:
- DN 100
- DN 125
- DN 150

Comparison:
[ Comparison ]
SP!RES against traditional methods

Comparison criteria:
- The need for excavation
- Access to a private area
- Repair time
- Restoration of landscaping
- The social factor
- Staff
- Reporting

### 3. `/technology/differences`

Page:
[ Main Technology Differences ]
SP!RES: A technology that has no analogues in the world

Cards:
- Remote sanitation — repairs at a distance of tens of meters from the entry point
- Lack of excavation — no dismantling, restoration of landscaping and approvals
- Legally relevant reporting — automatic PDF report with process parameters
- Economic efficiency — payback period from 1.5 to 6 months
- All season — work at any time of the year, regardless of the direction of flow

Technology sections:
1. Intelligent control system with the exclusion of the human factor
2. Creating a new pipe inside the old one by pressure inversion method
3. Rehabilitation of house and private connections without access to the property
4. Automatic technical report with evidence base

### 4. `/solutions`

[ Main Solutions ]
Solutions for all types of rehabilitation tasks

Cards:
- For municipalities and public utilities
- For management companies and HOAs
- For industrial enterprises and factories

### 5. `/solutions/municipalities`

[ Main Solutions A solution for municipalities and urban utilities ]
A solution for municipalities and urban utilities

Sections:
- Economy
- Advantages
- Suitable for whom
- Application

Economy cards:
- Up to 70% budget savings
- Reduction of repair time
- Lack of social benefits and compensations
- Minimum staff

Advantages:
- Without access to private property
- Preservation of green areas and infrastructure
- Compliance with ESG standards
- Transparency and accountability
- Without noise and overlap

Suitable for:
- City administrations and municipalities
- Utilities and water utilities
- Management companies of apartment buildings
- Contractors that carry out municipal orders
- Connection of private houses to the central sewerage system

### 6. `/materials`

[ Main Materials ]
Supplies for professional sanitation

Cards:
- Liners for sanitation DN100, DN125, DN150

### 7. `/materials/liners`

[ Main Materials Polymer liners for trenchless repairs ]
Polymer liners for trenchless repairs

Product cards:
- Polymer sleeve SP!RES Liner DN100 (4 mm wall)

### 8. `/materials/liners/dn100`

[ Main Materials Polymer liners for trenchless repairs Polymer sleeve SP!RES Liner DN100 (4 mm wall) ]
Polymer sleeve SP!RES Liner DN100 (4 mm wall)

Description:
SP!RES Liner DN100 is a ready-to-use sleeve impregnated with a two-component heat-curing resin. Designed specifically for the restoration of pipes with a diameter of 100 mm by inversion using the SP!RES system.

Application:
- Restoring home connections
- Repair of sewer outlets from buildings
- Rehabilitation of horizontal network sections
- Removal of cracks, fistulas, and corrosion damage

Specifications:
- Diameter (nominal): DN100
- Wall thickness after polymerization: 4 mm
- Length: 3 m, 6 m, 9 m, 12 m
- Base material: Polyester (PES)
- Resin Type: Heat-cured
- Polymerization time at 80C: 60 minutes
- Max. operating temperature: +50C, short-term up to +80C
- Stiffness class: SN4, on request SN8
- Display color: White outer layer, blue marker
- Packaging: Vacuum packaging + thermal container

### 9. `/training`

[ Main Training ]
Learning how to work with the system

Sections:
- Key learning outcomes
- Learning formats
- Why learning is an investment, not an expense
- Support

Learning formats:
1. Video Tutorials and Mobile app (Quick Start)
2. Offline course with an engineer (On-site practice)
3. Certification and professional development

Investment cards:
- Saving materials
- Safety
- Customer's trust
- Legal purity
- Confidence

Support:
- Constant access to video instructions
- Consulting engineers
- Future: 24/7-enabled mobile app
- Network of training centers

### 10. `/contacts`

[ Main Contacts ]
Contacts

Data:
- Address: Hamburg, Germany
- General questions: info@spires.com
- Technical support: support@spires.com
- Sales Department: sales@spires.com
- Opening hours: Mon-Fri, 09:00-18:00

Distributors:
[ Distributors ]
Our official distributors and partners

### 11. `/articles`

[ Main Articles ]
SP!RES blog and technical articles

Article cards:
How Inversion Sanitation works: a detailed technology guide

### 12. `/articles/inversion-sanitation`

[ Main Articles How inversion sanitation works: a detailed guide to SP!RES technology ]

Date:
15.03.2026

Title:
How inversion sanitation works: a detailed guide to SP!RES technology

Sections:
- What is inversion sanitation?
- Stage 1: Preparation and diagnosis
- Stage 2: Broaching the liner in a straight position
- Specifications table

### 13. `/cases`

[ Main Cases ]
Real projects of SP!RES

Case cards:
Real-world examples of our technologies

### 14. `/cases/hamburg`

[ Main Cases Sanitation of sewer connections in the historic center of Hamburg ]

Title:
Sanitation of sewer connections in the historic center of Hamburg

Sections:
- Key parameters
- Objectives and goals
- Description
- Results
- Reviews
- Similar projects

Results table:
Criteria:
- Deadlines
- The need for excavation
- Access to the basements
- Complaints from residents
- Budget
- Reporting

Traditional method:
- 3-4 weeks
- Yes
- Yes
- High risk
- 100%
- Photos, acts

SP!RES method:
- 3 days
- No
- No
- 0 complaints
- 65% savings
- Legally significant PDF

### 15. `/privacy-policy`

Privacy policy page with long text content.

### 16. `*`

404 page:
404
This page may have been deleted, its address has changed, or it is temporarily unavailable.
Buttons:
- Contact us
- Go back to the main page

### 17. `/in-development`

In development page:
The page is temporarily unavailable. We are already doing this. Thank you for your patience.

### 18. `/coming-soon`

Coming soon page:
Creating the Future
Our site is undergoing renovations! We're preparing a new version. Don’t forget to check back soon!

Contacts:
Alex Lisnik
Technical Director
info@spire-s.com
a.lisnik@spire-s.com

## Implementation priority

First pass:
- working React project
- all routes
- shared layout
- reusable components
- responsive structure
- placeholder images
- data separated into src/data/
- visual style close to Figma

Do not aim for perfect pixel-perfect implementation in the first pass.
Do not waste Figma MCP requests for details that can be inferred from this brief and docs/figma.css.