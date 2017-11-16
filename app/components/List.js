import React from 'react';

export default function List({ list, type, onSelect, children })  {
	const childrenFiltered = (id) => {
		if(children) {
			return React.Children.map(children, child => {
				return React.cloneElement(child, {
					...child.props,
					list: child.props.list.filter(grandChild => {
						return grandChild[child.props.parent] === id;
					})
				});
			});
		}
	};

	return (
		<div style={{ border: '1px solid #000', margin: '10px' }}>
			{list.map((item) => {
				return (
					<div key={item.id} onClick={ (e) => { e.stopPropagation(); return onSelect(type, item.id) }} style={{ cursor: 'pointer', padding: '5px 10px'}}>
						<input type="checkbox" checked={item.selected} />
						{item.name}

						{childrenFiltered(item.id)}
					</div>
				);
			})}
		</div>
	);
}
