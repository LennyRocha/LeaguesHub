import React from 'react'
import 'bootstrap'
import "../../css/usuario.css";

export default function UsuarioTabla1 (equipos) {
  return (
    <div className='my-5' id='clasif'>
        <h1>Tablas de Clasificación</h1>
        <div className="over-auto">
        <table className='table'>
            <thead className='myThead'>
                <th>POS</th>
                <th></th>
                <th>EQUIPO</th>
                <th>JJ</th>
                <th>JG</th>
                <th>JE</th>
                <th>JP</th>
                <th>GF</th>
                <th>GC</th>
                <th>DIFF</th>
                <th>PTS</th>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td className='imgCell'><img src="https://th.bing.com/th/id/OIP.EsWex0S9Lwksykh1kD00XQHaI3?rs=1&pid=ImgDetMain" alt="Chivas" width={30} height={30} /></td>
                    <td>Equipo 1</td>
                    <td>24</td>
                    <td className='jg'>20</td>
                    <td className='je'>3</td>
                    <td className='jp'>1</td>
                    <td>50</td>
                    <td>49</td>
                    <td className='diff'>1</td>
                    <td className='pts'>+39</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td className='imgCell'><img src="https://th.bing.com/th/id/OIP.EsWex0S9Lwksykh1kD00XQHaI3?rs=1&pid=ImgDetMain" alt="Chivas" width={30} height={30} /></td>
                    <td>Equipo 1</td>
                    <td>24</td>
                    <td className='jg'>20</td>
                    <td className='je'>3</td>
                    <td className='jp'>1</td>
                    <td>50</td>
                    <td>49</td>
                    <td className='diff'>1</td>
                    <td className='pts'>+39</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
  )
}
