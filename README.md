# LaunchLensAI

**AI-Powered Startup Validation Platform**

LaunchLensAI helps entrepreneurs validate startup ideas using artificial intelligence. Enter a business idea, and LaunchLensAI generates a comprehensive investor-style report including competitor analysis, market size estimates, SWOT analysis, monetization strategies, patent research, domain suggestions, and launch recommendations.

---

## Live Demo

**Frontend:**

https://launchlensai-y28n.onrender.com

---

### Home Page


![Home](images/HomePage.png)

---

### Business Validation Report


![Dashboard](images/BusinessValidationReport.png)

---

### Saved Reports


![History](images/SavedReports.png)

---

##  Features

* AI-powered startup validation
* Investor-style business reports
* Competitor analysis
* TAM / SAM / SOM market estimates
* Monetization strategy recommendations
* SWOT analysis
* Launch roadmap generation
* Domain name suggestions
* Save reports with Firebase Firestore
* Favorite reports
* Search report history
* Google Authentication
* Responsive modern interface

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React
* Recharts

### Backend

* Node.js
* Express
* Groq API (Llama 3.3 70B)

### Database

* Firebase Firestore

### Authentication

* Firebase Authentication
* Google Sign-In

### Hosting

* Firebase Hosting
* Render

---

## Project Structure

```text
src/
 ├── components/
 ├── firebase/
 ├── styles/
 ├── types/
 ├── App.tsx
 └── main.tsx

server.ts
package.json
firebase.json
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/Pezeoma88/LaunchLensAI.git
```

Move into the project

```bash
cd LaunchLensAI
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
GROQ_API_KEY=your_api_key_here
```

Start the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:3000
```

---

## Deployment

* Render

---

## Future Improvements

* Export reports as PDF
* Share reports with public links
* AI chat for startup coaching
* Team collaboration
* Investor score prediction
* Startup funding recommendations
* Industry trend analysis
* Multi-language support

---

## Author

**Prince Ezeoma**

Creative Computing Student at Southern Methodist University (SMU)

GitHub:
https://github.com/Pezeoma88

---

## License

This project is licensed under the MIT License.
