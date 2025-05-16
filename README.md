# Advanced Calculator with Tags and History

A modern calculator application with both standard and scientific calculator functionality, featuring tag-based organization and calculation history storage.

## Features

- Standard calculator operations (addition, subtraction, multiplication, division)
- Scientific calculator operations (trigonometric functions, logarithms, powers, etc.)
- Tag-based organization (Entertainment, Food, Shopping, Bike, Other)
- Calculation history with search and filter capabilities
- Date-based filtering
- Edit and delete functionality for saved calculations
- Responsive design for all devices
- Modern and clean user interface

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- JavaScript (ES6+)
- Node.js
- Express.js
- MySQL
- Font Awesome Icons

## Prerequisites

- Node.js (v12 or higher)
- MySQL Server
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/calculator-app.git
   cd calculator-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```sql
   CREATE DATABASE calculator_db;
   USE calculator_db;
   
   CREATE TABLE calculations (
       id INT AUTO_INCREMENT PRIMARY KEY,
       expression VARCHAR(255) NOT NULL,
       result VARCHAR(255) NOT NULL,
       tag VARCHAR(50),
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. Update database configuration:
   - Open `server.js`
   - Update the database connection details if needed:
     ```javascript
     const db = mysql.createConnection({
         host: 'localhost',
         user: 'your_username',
         password: 'your_password',
         database: 'calculator_db'
     });
     ```

5. Start the server:
   ```bash
   node server.js
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Basic Calculator:
   - Use the standard calculator for basic arithmetic operations
   - Click "Switch to Scientific" for advanced functions

2. Tagging Calculations:
   - Select a tag from the dropdown before calculating
   - Tags help organize and filter calculations

3. History Management:
   - View calculation history in the right panel
   - Search by tag using the search input
   - Filter by date range using the date pickers
   - Edit or delete previous calculations

4. Scientific Functions:
   - Trigonometric functions (sin, cos, tan)
   - Logarithms (log, ln)
   - Powers and roots
   - Constants (π, e)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Express.js team for the web framework
- MySQL team for the database 