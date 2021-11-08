import React from 'react';
import {Link, withRouter} from 'react-router-dom';

function Auditengine() {
  return (
  <nav className="audit-engine">
      <Link className="link" to='/auditevent'>Audit Events</Link>
      <Link className="link"  to='/auditmaster'>Audit Master</Link>
     </nav>
  );
}

export default Auditengine;