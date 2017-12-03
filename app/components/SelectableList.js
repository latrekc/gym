import React from 'react';

export default function SelectableList({ list, exercises, filters, onSelect })  {
	return (
		<div style={{ display: 'inline-block'}}>
			{list.map((item) => {
				return (
					<div key={item.id} onClick={ (e) => { e.stopPropagation(); return onSelect( [exercises, item.type, item.mode].join(';') ) }} style={{ display: 'inline-block', cursor: 'pointer', padding: '0px 5px 0 0'}}>
						<input type="checkbox" checked={filters.some(filter => filter === [exercises, item.type, item.mode].join(';') )} />
						{item.name}
					</div>
				);
			})}
		</div>
	);
}
