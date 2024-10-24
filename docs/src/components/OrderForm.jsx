import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const OrderForm = () => {
    const [phone, setPhone] = useState('+380');
    const [contactMethod, setContactMethod] = useState('viber');
    const [plantSort, setPlantSort] = useState('');
    const [plantSorts, setPlantSorts] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingSort, setEditingSort] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [novaPoshtaCity, setNovaPoshtaCity] = useState('');
    const [novaPoshtaRegion, setNovaPoshtaRegion] = useState('');
    const [novaPoshtaWarehouse, setNovaPoshtaWarehouse] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('+380');
    const [recipientSurname, setRecipientSurname] = useState('');
    const [message, setMessage] = useState('');
    const [thankYouMessage, setThankYouMessage] = useState('');

    const addPlantSort = () => {
        if (plantSort.trim() !== '') {
            setPlantSorts([...plantSorts, plantSort]);
            setPlantSort('');
            calculateTotalCost([...plantSorts, plantSort]);
        }
    };

    const handleEditSort = (index) => {
        setEditingIndex(index);
        setEditingSort(plantSorts[index]);
    };

    const saveEditSort = () => {
        if (editingSort.trim() !== '') {
            const newSorts = [...plantSorts];
            newSorts[editingIndex] = editingSort;
            setPlantSorts(newSorts);
            setEditingIndex(null);
            setEditingSort('');
            calculateTotalCost(newSorts);
        }
    };

    const handleDeleteSort = (index) => {
        const newSorts = plantSorts.filter((_, i) => i !== index);
        setPlantSorts(newSorts);
        calculateTotalCost(newSorts);
    };

    const calculateTotalCost = (sorts) => {
        const count = sorts.length;
        setTotalCost(count * 45);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+380\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePhone(phone) || !validatePhone(recipientPhone)) {
            setMessage('Будь ласка, введіть правильний номер телефону у форматі +380XXXXXXXXX');
            return;
        }
        if (plantSorts.length < 4) {
            setMessage('Будь ласка, додайте щонайменше чотири сорти рослин');
            return;
        }
        if (!novaPoshtaCity || !novaPoshtaRegion || !novaPoshtaWarehouse || !recipientSurname) {
            setMessage('Будь ласка, заповніть всі дані для відправлення');
            return;
        }
        setMessage('');

        const orderData = {
            phone,
            contactMethod,
            plantSorts,
            novaPoshtaCity,
            novaPoshtaRegion,
            novaPoshtaWarehouse,
            recipientPhone,
            recipientSurname,
            totalCost
        };

        try {
            // Send a POST request to the backend
            const response = await axiosInstance.post('/api/orders', orderData); // Adjust the endpoint as needed
            if (response.status === 200) {
                console.log(response.data);
                setThankYouMessage(
                    'Дякуємо за ваше замовлення! Якщо у вас виникли питання, будь ласка, напишіть у Viber за номером +380639746386. Замовлення відправляються кожного понеділка.'
                );
            } else {
                setMessage('Виникла помилка при відправці замовлення. Спробуйте ще раз.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            setMessage('Виникла помилка при відправці замовлення. Спробуйте ще раз.');
        }
    };


    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        boxSizing: 'border-box'
    };

    const formStyle = {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
    };

    const sectionStyle = {
        margin: '20px 0', // Space between sections
        padding: '15px',  // Padding inside each section
        backgroundColor: '#f0f0f0', // Optional: background color for better visual separation
        borderRadius: '8px'
    };

    const buttonStyle = {
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    const mainButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#FF5733', // Main button color
        fontSize: '18px', // Larger font size for the main button
        fontWeight: 'bold'
    };

    const actionButtonStyle = {
        padding: '5px 10px',
        margin: '0 5px',
        backgroundColor: '#007BFF', // Blue color for action buttons
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    return (
        <div style={{ padding: '10px' }}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={sectionStyle}>
                    <h3>1. Контактна інформація</h3>
                    <div>
                        <label>Ваш телефон:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            maxLength={13}
                            placeholder="+380XXXXXXXXX"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>Спосіб зв’язку:</label>
                        <select
                            value={contactMethod}
                            onChange={(e) => setContactMethod(e.target.value)}
                            required
                            style={inputStyle}
                        >
                            <option value="viber">Viber</option>
                            <option value="telegram">Telegram</option>
                            <option value="fb">Facebook Messenger</option>
                        </select>
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3>2. Сорти рослин</h3>
                    <div>
                        <input
                            type="text"
                            value={plantSort}
                            onChange={(e) => setPlantSort(e.target.value)}
                            placeholder="Додати сорт"
                            style={inputStyle}
                        />
                        <button type="button" onClick={addPlantSort} style={buttonStyle}>Додати сорт</button>
                    </div>
                    {plantSorts.length > 0 && (
                        <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Сорт</th>
                                    <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Дії</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plantSorts.map((sort, index) => (
                                    <tr key={index}>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={editingSort}
                                                    onChange={(e) => setEditingSort(e.target.value)}
                                                    style={{ width: '90%', padding: '5px' }}
                                                />
                                            ) : (
                                                sort
                                            )}
                                        </td>
                                        <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
                                            {editingIndex === index ? (
                                                <button
                                                    type="button"
                                                    onClick={saveEditSort}
                                                    style={{ padding: '5px', marginRight: '5px' }}
                                                >
                                                    Зберегти
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditSort(index)}
                                                    style={actionButtonStyle} // Updated style for buttons
                                                >
                                                    Редагувати
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSort(index)}
                                                style={actionButtonStyle} // Updated style for buttons
                                            >
                                                Видалити
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <h4>Загальна вартість: {totalCost} грн</h4>
                </div>

                <div style={sectionStyle}>
                    <h3>3. Доставка</h3>
                    <div>
                        <label>Місто (Нова Пошта):</label>
                        <input
                            type="text"
                            value={novaPoshtaCity}
                            onChange={(e) => setNovaPoshtaCity(e.target.value)}
                            placeholder="Введіть місто"
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>Регіон (Нова Пошта):</label>
                        <input
                            type="text"
                            value={novaPoshtaRegion}
                            onChange={(e) => setNovaPoshtaRegion(e.target.value)}
                            placeholder="Введіть регіон"
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>Відділення (Нова Пошта):</label>
                        <input
                            type="text"
                            value={novaPoshtaWarehouse}
                            onChange={(e) => setNovaPoshtaWarehouse(e.target.value)}
                            placeholder="Введіть відділення"
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3>4. Отримувач</h3>
                    <div>
                        <label>Прізвище отримувача:</label>
                        <input
                            type="text"
                            value={recipientSurname}
                            onChange={(e) => setRecipientSurname(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label>Телефон отримувача:</label>
                        <input
                            type="text"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                            required
                            maxLength={13}
                            placeholder="+380XXXXXXXXX"
                            style={inputStyle}
                        />
                    </div>
                </div>

                <button type="submit" style={mainButtonStyle}>Надіслати замовлення</button>
                {message && <p style={{ color: 'red' }}>{message}</p>}
                {thankYouMessage && <p style={{ color: 'green' }}>{thankYouMessage}</p>}
            </form>
        </div>
    );
};

export default OrderForm;
