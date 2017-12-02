import React from 'react';

export default function GroupsList({ list, filterChildren, children })  {
	return (
		<div style={{ margin: '10px' }}>
			{list.map((item) => {
				return (
					<div key={item.id} style={{ padding: '5px 10px'}}>
						<span style={{ fontWeight: 'bold'}}>{item.name}</span>

						{filterChildren(item, children)}
					</div>
				);
			})}
		</div>
	);
}
