import React from 'react';

export default function Exercises({ list, filterChildren, children })  {
	return (
		<div>
			{list.map((item) => {
				return (
					<div key={item.id} style={{ padding: '5px 10px'}}>
						{item.name}: {filterChildren('exercises', 'typemodes', item, children)}
					</div>
				);
			})}
		</div>
	);
}
