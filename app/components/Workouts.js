import React from 'react';

export default function Workouts({ logs, exercises, typemodes })  {
	return (
		<div>
			{logs.data.map((item) => {
				return (
					<div key={item.id} style={{ padding: '5px 10px'}}>
						{JSON.stringify(item)}
					</div>
				);
			})}
		</div>
	);
}
