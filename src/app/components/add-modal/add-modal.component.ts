import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Mail } from 'src/app/interface/mail';
import { Product } from 'src/app/interface/product';
import { User } from 'src/app/interface/user';
import { BackendService } from 'src/app/service/backend.service';
import { Events } from 'src/app/service/events';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html'
})
export class AddModalComponent {

  public type: 'Mail' | 'Product' | 'User';
  public param;

  public product: Product = {
    name: '',
    barcodeId: '',
    qtd: 0
  }
  public user: User = {
    name: '',
    email: ''
  }
  public mail: Mail = { email: '' }

  constructor(
    private db: BackendService,
    public modal: ModalController,
    private global: GlobalService,
    private params: NavParams,
    private ev: Events
  ) {

  this.type = this.params.get('type');
  this.param = this.params.get('param');

  switch (this.type) {
    case 'Product':
      if (this.param)
        this.product = { name: this.param.get('name'), barcodeId: this.param.get('barcodeId'), id: this.param.id, qtd: 0}
      break;
    case 'User':
      if (this.param)
        this.user = { name: this.param.get('name'), email: this.param.get('email'), id: this.param.id}
      break;
  
    default:

      break;
  }

  }
  /**  
    * Save or update a Parse Object
    * "type" define which class control
    * @returns NULL.
  */
  public saveObject() {
    this.global.loadInit();
    switch (this.type) {
      case 'Mail':
        this.db.createEmail(this.mail).then((res) => {
          this.modal.dismiss(res);
        }).catch(error => {
          this.global.showToast(this.db.erroValidators(error), 5000);
          this.global.loadEnd();
        });
        break;
      case 'Product':
        if (this.product.id)
          this.db.updateProduct(this.product).then((res) => {
            this.modal.dismiss(res);
          }).catch(error => {
            this.global.showToast(this.db.erroValidators(error), 5000);
            this.global.loadEnd();
          });
        else
        this.db.createProduct(this.product).then((res) => {
          this.modal.dismiss(res);
        }).catch(error => {
          this.global.showToast(this.db.erroValidators(error), 5000);
          this.global.loadEnd();
        });
        break;
      case 'User':
        if (this.user.id)
          this.db.UpdateUser(this.user).then((res) => {
            this.modal.dismiss(res);
          }).catch(error => {
            this.global.showToast(this.db.erroValidators(error), 5000);
            this.global.loadEnd();
          });
        else
        this.db.createUser(this.user).then((user) => {
          this.db.resetPassword(user.get('email')).then(() => {
            this.global.showToast('Ask the user to check the mail inbox.', 5000);
            this.modal.dismiss(user);
          });
        }).catch(error => {
          this.global.showToast(this.db.erroValidators(error), 5000);
          this.global.loadEnd();
        });
        break;
    
      default:
        this.global.loadEnd();
        break;
    }
  }

  /**
   * When barcodeInput lose focus.
  */
  public focusedInBarcodeInput() {
    //  ZEBRA subscribe event
    this.ev.subscribe('data:scan', async (data: any) => {
      let codeScanned = data.scanData.extras["com.symbol.datawedge.data_string"];
      this.product.barcodeId = codeScanned;
    });
  }
  /**
   * When barcodeInput init focus.
  */
  public blurBarcodeInput() {
    this.ev.destroy('data:scan')
  }

}
