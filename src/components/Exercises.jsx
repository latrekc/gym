import React from 'react';

export default function Exercises({ list, filters, onSelect })  {
	return (
		<div>
			{list.map((item) => {
				return (
					<div key={item.id} onClick={ (e) => { e.stopPropagation(); return onSelect( item.id ) }} style={{ cursor: 'pointer', padding: '0px 5px 0 0'}}>
						<input type="radio" checked={filters.exercises == item.id} readOnly />
						{item.name}
					</div>
				);
			})}
		</div>
	);
}
