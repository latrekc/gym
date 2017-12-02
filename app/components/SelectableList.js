import React from 'react';

export default function SelectableList({ list, exercises, filters, onSelect })  {
	return (
		<div style={{ display: 'inline-block'}}>
			{list.map((item) => {
				return (
					<div key={item.id} onClick={ (e) => { e.stopPropagation(); return onSelect({ exercise: exercises, mode:item.mode, type: item.type }) }} style={{ display: 'inline-block', cursor: 'pointer', padding: '0px 5px 0 0'}}>
						<input type="checkbox" checked={filters.some(filter => filter.exercise === exercises && filter.mode === item.mode && filter.type === item.type )} />
						{item.name}
					</div>
				);
			})}
		</div>
	);
}
