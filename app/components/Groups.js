import React from 'react';

export default function Groups({ list, filterChildren, children })  {
	return (
		<div>
			{list.map((item) => {
				return (
					<div key={item.id} style={{ padding: '5px 10px'}}>
						<span style={{ fontWeight: 'bold'}}>{item.name}</span>

						{filterChildren('groups', 'exercises', item, children)}
					</div>
				);
			})}
		</div>
	);
}
