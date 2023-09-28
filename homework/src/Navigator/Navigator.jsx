/* eslint-disable react/prop-types */
import { useState } from "react"
import styles from './Navigator.module.css'

// type Active = {
//     isActived: number
//     setIsActived: React.Dispatch<React.SetStateAction<string>>
// }

const Navigator = ({isActived, setIsActived}) => {
    const [states] = useState([
        {
            id: 'following',
            name: 'Following'
        },
        {
            id: 'forU',
            name: 'For You'
        }
    ])
    return (
        <nav className={styles.container}>
            <ul className={styles.navigator}>
                {
                    states.map(state =>
                        <li
                            className={isActived === state.id ? `${styles.isActived}` : ''}
                            key={state.id}
                            onClick={() => setIsActived(state.id)}
                        >
                            <a href="#">{state.name}</a>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}

export default Navigator