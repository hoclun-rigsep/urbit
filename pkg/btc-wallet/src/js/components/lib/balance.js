import React, { Component } from 'react';
import {
  Box,
  Icon,
  Row,
  Text,
  Button,
  Col,
} from '@tlon/indigo-react';

import Send from './send.js'

function currencyFormat(sats, conversion, denomination) {
  let val;
  let text;
  switch (denomination) {
    case "USD":
    case "CAD":
      val = sats * 0.00000001 * conversion[denomination]
      text = '$' + val.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      break;
    case "BTC":
      val = sats * 0.00000001;
      text =  'BTC ' + val;
      break;
    default:
      break;
  }
  return text;
}

export default class Balance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversion: {
        USD: 50000,
        CAD: 70000,
        BTC: 1,
      },
      denomination: "USD",
      sending: false,
      copied: false,
    }

    this.copyAddress = this.copyAddress.bind(this);
  }

  componentDidMount() {
    fetch('https://blockchain.info/tobtc?currency=USD&value=1')
      .then(res => res.json())
      .then(n => {
        this.setState({conversion: {USD: 1/n, CAD: 70000, BTC: 1}});
      });
  }

  copyAddress() {
    let address = this.props.state.address;
    function listener(e) {
      e.clipboardData.setData('text/plain', address);
      e.preventDefault();
    }

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);

    this.props.api.btcWalletCommand({'gen-new-address': null});
    this.setState({copied: true});
    setTimeout(() => {
      this.setState({copied: false});
    }, 2000);
  }


  render() {
    const sats = (this.props.state.balance || 0);
    const value = currencyFormat(sats, this.state.conversion, this.state.denomination);
    const sendDisabled = (sats === 0);
    const addressText = (this.props.state.address === null) ? '' :
      this.props.state.address.slice(0, 6) + '...' +
      this.props.state.address.slice(-6);

    return (
      <>
        {this.state.sending ?
         <Send
           api={api}
           shipWallets={this.props.state.shipWallets}
           value={value}
           denomination={this.state.denomination}
           sats={sats}
           conversion={this.state.conversion}
           stopSending={() => {this.setState({sending: false})}}
         /> :
         <Col
           height="400px"
           width='100%'
           backgroundColor="white"
           borderRadius="32px"
           justifyContent="space-between"
           mb={5}
           p={5}
         >
           <Row justifyContent="space-between">
             <Text color="orange" fontSize={1}>Balance</Text>
             <Text color="lighterGray" fontSize="14px" mono>{addressText}</Text>
             <Row>
               <Icon icon="ChevronDouble" color="orange" pt="2px"/>
               <Text color="orange" fontSize={1}>{this.state.denomination}</Text>
             </Row>
           </Row>
           <Col justifyContent="center" alignItems="center">
             <Text fontSize="52px" color="orange">{value}</Text>
             <Text fontSize={1} color="orange">{sats} sats</Text>
           </Col>
           <Row flexDirection="row-reverse">
             <Button children="Send"
                     disabled={sendDisabled}
                     fontSize={1}
                     fontWeight="bold"
                     color={sendDisabled ? "lighterGray" : "white"}
                     backgroundColor={sendDisabled ? "veryLightGray" : "orange"}
                     style={{cursor: sendDisabled ? "default" : "pointer" }}
                     borderColor="none"
                     borderRadius="24px"
                     py="24px"
                     px="24px"
                     onClick={() => this.setState({sending: true})}
             />
             <Button children={(this.state.copied) ? "Address Copied!" : "Copy Address"}
                     mr={3}
                     disabled={this.state.copied}
                     fontSize={1}
                     fontWeight="bold"
                     color={(this.state.copied) ? "green" : "orange"}
                     backgroundColor={(this.state.copied) ? "veryLightGreen" : "midOrange" }
                     style={{cursor: (this.state.copied) ? "default" : "pointer"}}
                     borderColor="none"
                     borderRadius="24px"
                     py="24px"
                     px="24px"
                     onClick={this.copyAddress}
             />
           </Row>
          </Col>
        }
      </>
    );
  }
}
