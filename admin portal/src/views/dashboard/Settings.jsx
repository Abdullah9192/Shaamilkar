import React from 'react'
import building from '../../assets/images/svg/building.svg'
import grid from '../../assets/images/svg/grid.svg'
import box from '../../assets/images/svg/box.svg'
import coinstack from '../../assets/images/svg/coinstack.svg'
import treecoins from '../../assets/images/svg/threecoins.svg'
import { useNavigate } from 'react-router-dom'
const Settings = () => {
  const settings = [
    {
      Image: building,
      title: 'Penalty Setup',
    },
    {
      Image: grid,
      title: 'Product Category Setup',
    },
    {
      Image: box,
      title: 'Product Setup',
    },
    {
      Image: coinstack,
      title: 'Companies Setup',
    },
    {
      Image: treecoins,
      title: 'Installement Setup',
    },
  ]
  let navigate = useNavigate()
  const handleCardClick = (title) => {
    switch (title) {
      case 'Penalty Setup':
        navigate('/settings/penalty-setup')
        break
      case 'Product Category Setup':
        navigate('/settings/product-category-setup')
        break
      case 'Product Setup':
        navigate('/settings/product-setup')
        // alert('Installement Setup')
        break
      case 'Companies Setup':
        navigate('/settings/company-setup')
        break
      case 'Installement Setup':
        navigate('/settings/installment-plan')
        // alert('Installement Setup')
        break

      default:
        alert('not found')
        break
    }
  }
  return (
    <div>
      <div className="row">
        {settings.map((item, index) => (
          <div className="col text-center" key={index}>
            <div className="card p-3 custom-card" onClick={() => handleCardClick(item.title)}>
              <div className="text-center">
                <img src={item.Image} className="img-fluid" alt="" />
              </div>
            </div>
            <h6 className="mt-2">{item.title}</h6>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings
