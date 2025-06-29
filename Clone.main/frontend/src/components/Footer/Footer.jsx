import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content compact-footer">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" style={{maxWidth: 80, marginBottom: 8}} />
            <p style={{fontSize: '0.95rem', margin: 0}}>123 Demo Street, Suite 456<br/>New York, NY 10001</p>
        </div>
        <div className="footer-content-center">
            <ul>
                <li>Refund Policy</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <ul>
                <li>+1-555-123-4567</li>
                <li>support@demo-company.com</li>
            </ul>
        </div>
      </div>
      <hr />
    </div>
  )
}

export default Footer
