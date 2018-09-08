import React from 'react';

export default function Groups({ list, filterChildren, children })  {
	return (
		<div style={{width: '20%', position: 'fixed', height: '100%', overflowY: 'scroll', left: 0, top: 0 }}>
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
