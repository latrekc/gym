import React from 'react';

export default function List({ list, type, onSelect })  {
	return (
		<div style={{ border: '1px solid #000', margin: '10px' }}>
			{list.map((item) => {
				return (
					<div key={item.id} onClick={onSelect.bind(null, type, item.id)} style={{ cursor: 'pointer', padding: '5px 10px'}}>
						<input type="checkbox" checked={item.selected} />
						{item.name}
					</div>
				);
			})}
		</div>
	);
}
