import React from 'react';
import styles from './Exercises.css';

export default function Exercises(props)  {
	return (
		<div className={styles.list}>
			{props.list.map((i) => {
				return (
					<div className={styles.item} key={i}>
						<input type="checkbox" />
						<label>{i}</label>
					</div>
				);
			})}
		</div>
	);
}
