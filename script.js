document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const modeToggle = document.getElementById('modeToggle');
    const tagSelect = document.getElementById('tagSelect');
    const searchInput = document.getElementById('searchInput');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const searchBtn = document.getElementById('searchBtn');
    const standardKeys = document.querySelector('.standard-keys');
    const scientificKeys = document.querySelector('.scientific-keys');
    const historyList = document.getElementById('historyList');
    
    let currentInput = '';
    let isScientificMode = false;
    let editingId = null;
    
    // Toggle between standard and scientific calculator
    modeToggle.addEventListener('click', () => {
        isScientificMode = !isScientificMode;
        scientificKeys.style.display = isScientificMode ? 'grid' : 'none';
        modeToggle.textContent = isScientificMode ? 'Switch to Standard' : 'Switch to Scientific';
    });
    
    // Handle number and operator clicks
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            
            if (button.classList.contains('number') || button.classList.contains('decimal')) {
                currentInput += value;
            } else if (button.classList.contains('operator')) {
                currentInput += ` ${value} `;
            } else if (button.classList.contains('sci-operator')) {
                handleScientificOperator(value);
            } else if (button.classList.contains('clear')) {
                currentInput = '';
                editingId = null;
            } else if (button.classList.contains('equals')) {
                calculateResult();
            }
            
            updateDisplay();
        });
    });
    
    // Handle scientific operators
    function handleScientificOperator(operator) {
        switch(operator) {
            case 'sin':
                currentInput = `Math.sin(${currentInput})`;
                break;
            case 'cos':
                currentInput = `Math.cos(${currentInput})`;
                break;
            case 'tan':
                currentInput = `Math.tan(${currentInput})`;
                break;
            case 'log':
                currentInput = `Math.log10(${currentInput})`;
                break;
            case 'ln':
                currentInput = `Math.log(${currentInput})`;
                break;
            case '√':
                currentInput = `Math.sqrt(${currentInput})`;
                break;
            case 'x²':
                currentInput = `Math.pow(${currentInput}, 2)`;
                break;
            case 'xʸ':
                currentInput += '^';
                break;
            case 'π':
                currentInput += 'Math.PI';
                break;
            case 'e':
                currentInput += 'Math.E';
                break;
            default:
                currentInput += operator;
        }
    }
    
    // Calculate result
    function calculateResult() {
        try {
            // Replace operators with JavaScript operators
            let expression = currentInput
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**');
            
            // Evaluate the expression
            const result = eval(expression);
            
            // Save to history with tag
            const tag = tagSelect.value;
            if (editingId) {
                // Update existing calculation
                updateCalculation(editingId, currentInput, result, tag).then(() => {
                    // Update display and input
                    currentInput = result.toString();
                    updateDisplay();
                    
                    // Update history display
                    updateHistory();
                    
                    // Reset editing state
                    editingId = null;
                });
            } else {
                // Save new calculation
                saveCalculation(currentInput, result, tag).then(() => {
                    // Update display and input
                    currentInput = result.toString();
                    updateDisplay();
                    
                    // Update history display
                    updateHistory();
                });
            }
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
        }
    }
    
    // Update display
    function updateDisplay() {
        display.value = currentInput;
    }
    
    // Save calculation
    async function saveCalculation(expression, result, tag) {
        try {
            const response = await fetch('/save-calculation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expression,
                    result,
                    tag
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
    
    // Update calculation
    async function updateCalculation(id, expression, result, tag) {
        try {
            const response = await fetch(`/update-calculation/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expression,
                    result,
                    tag
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update calculation');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating calculation:', error);
        }
    }
    
    // Delete calculation
    async function deleteCalculation(id) {
        try {
            const response = await fetch(`/delete-calculation/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete calculation');
            }
            
            updateHistory();
        } catch (error) {
            console.error('Error deleting calculation:', error);
        }
    }
    
    // Edit calculation
    function editCalculation(id, expression, tag) {
        currentInput = expression;
        editingId = id;
        tagSelect.value = tag || '';
        updateDisplay();
    }
    
    // Update history display
    async function updateHistory() {
        const tag = searchInput.value;
        const start = startDate.value;
        const end = endDate.value;
        
        try {
            const response = await fetch(`/get-history?tag=${tag}&startDate=${start}&endDate=${end}`);
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            
            const history = await response.json();
            historyList.innerHTML = '';
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = item.tag || 'No Tag';
                
                const actions = document.createElement('div');
                actions.className = 'actions';
                
                const editBtn = document.createElement('button');
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.onclick = () => editCalculation(item.id, item.expression, item.tag);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBtn.onclick = () => deleteCalculation(item.id);
                
                actions.appendChild(editBtn);
                actions.appendChild(deleteBtn);
                
                const date = new Date(item.created_at).toLocaleString();
                
                historyItem.innerHTML = `
                    ${tagSpan.outerHTML}
                    <div>${item.expression} = ${item.result}</div>
                    <div class="date">${date}</div>
                `;
                historyItem.appendChild(actions);
                
                historyList.appendChild(historyItem);
            });
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    }
    
    // Search button click handler
    searchBtn.addEventListener('click', updateHistory);
    
    // Initial history load
    updateHistory();
}); 