document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/favorites')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('favorites-container');
            data.forEach(favorite => {
                const favoriteElement = document.createElement('div');
                favoriteElement.className = 'new-element';
                favoriteElement.style = 'position: relative; width: 840px; height: 120px; border: 1px solid black; border-radius: 10px; display: flex; justify-content: flex-start; align-items: center; margin-bottom: 20px;';

                favoriteElement.innerHTML = `
                    <img src="${favorite.photoUrl}" alt="${favorite.name}" style="width: 110px; height: 110px; border-radius: 10px; object-fit: contain; margin-left: 5px;">
                    <div style="display: inline-block; vertical-align: top; text-align: left; margin-left: 10px;">
                        <div style="font-size: 20px; font-weight: bold;">${favorite.name}</div>
                        <br>
                        <div style="font-size: 18px; color: #f4d442; display: inline-block; margin-top: 10px;">★ ${favorite.rating}</div>
                        <button style="font-size: 14px; margin-left: 400px; border-radius: 10px;">상세정보</button>
                        <button style="font-size: 14px; border-radius: 10px;">취소
                            <img src="/img/love.png" alt="Info Icon" style="width: 14px; height: 14px;">
                        </button>
                    </div>
                `;

                container.appendChild(favoriteElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});