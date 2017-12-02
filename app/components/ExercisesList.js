import React from 'react';

export default function ExercisesList({ list, filterChildren, children })  {
	return (
		<div>
			{list.map((item) => {
				return (
					<div key={item.id} style={{ padding: '5px 10px'}}>
						{item.name}: {filterChildren(item, children)}
					</div>
				);
			})}
		</div>
	);
}
