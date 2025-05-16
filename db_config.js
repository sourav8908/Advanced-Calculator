// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'calculator_db'
};

// Function to save calculation to database
async function saveCalculation(expression, result) {
    try {
        const response = await fetch('/save-calculation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                expression,
                result,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save calculation');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving calculation:', error);
    }
}

// Function to get calculation history
async function getCalculationHistory() {
    try {
        const response = await fetch('/get-history');
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
} 