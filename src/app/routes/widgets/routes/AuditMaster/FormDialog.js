import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function FormDialog({ open, handleRequestClose, rowdata }){
   return (
      <div>
       <Dialog open={open}>
          <DialogContent>
          <table className="audit-table">
        <tr>
          <th>Data Before</th>
          <th>Data After</th>
          <th>Additional Data</th>
        </tr>
        <tr>
          <td>{rowdata.additional_data}</td>
          <td>{rowdata.data_before}</td>
          <td>{rowdata.data_after}</td>
        </tr>
      </table>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRequestClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
export default FormDialog;