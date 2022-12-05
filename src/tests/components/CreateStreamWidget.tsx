export {};
// import * as React from 'react';
// import { shallow } from 'enzyme';
// import { swap } from './swap';

// describe('swap', () => {
//   let setLoading;
//   let showToast;
//   let setKeyNum;

//   beforeEach(() => {
//     setLoading = jest.fn();
//     showToast = jest.fn();
//     setKeyNum = jest.fn();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   it('should set loading to true and return if signer is null or undefined', async () => {
//     // Arrange
//     const signer = null;
//     const chain = { id: 1 };
//     const provider = {};
//     const store = {
//       inboundToken: { value: 'INBOUND' },
//       outboundToken: { value: 'OUTBOUND' }
//     };
//     const swapFlowRate = {};
//     const userToken0Flow = { current: { gt: jest.fn(() => false) } };

//     // Act
//     await swap(
//       signer,
//       chain,
//       provider,
//       store,
//       swapFlowRate,
//       userToken0Flow,
//       setLoading,
//       showToast,
//       setKeyNum
//     );

//     // Assert
//     expect(setLoading).toHaveBeenCalledWith(true);
//     expect(showToast).toHaveBeenCalledWith(ToastType.ConnectWallet);
//     expect(setLoading).toHaveBeenCalledWith(false);
//   });

//   it('should create a flow if userToken0Flow.current.gt returns false', async () => {
//     // Arrange
//     const signer = {};
//     const chain = { id: 1 };
//     const provider = {};
//     const store = {
//       inboundToken: { value: 'INBOUND' },
//       outboundToken: { value: 'OUTBOUND' }
//     };
//     const swapFlowRate = {};
//     const userToken0Flow = { current: { gt: jest.fn(() => false) } };
//     const superfluid = {
//       cfaV1: {
//         createFlow: jest.fn(() => ({
//           exec: jest.fn(() => Promise.resolve({
//             wait: jest.fn(() => Promise.resolve())
//           }))
//         }))
//       }
//     };
//     Framework.create = jest.fn(() => Promise.resolve(superfluid));
//     getPoolAddress = jest.fn(() => 'POOL_ADDRESS');

//     // Act
//     await swap(
//       signer,
//       chain,
//       provider,
//       store,
//       swapFlowRate,
//       userToken0Flow,
//       setLoading,
//       showToast,
//       setKeyNum
//     );

//     // Assert
//     expect(setLoading).toHaveBeenCalledWith(true);
//     expect(Framework.create).toHaveBeenCalledWith({
//       chainId: 1,
//       provider
//     });
//     expect(superfluid.cfaV1.createFlow

//         //

// import * as React from 'react';
// import { act, renderHook } from '@testing-library/react-hooks';
// import { swap } from './swap';

// describe('swap', () => {
//   let setLoading;
//   let showToast;
//   let setKeyNum;

//   beforeEach(() => {
//     setLoading = jest.fn();
//     showToast = jest.fn();
//     setKeyNum = jest.fn();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   it('should set loading to true and return if signer is null or undefined', async () => {
//     // Arrange
//     const signer = null;
//     const chain = { id: 1 };
//     const provider = {};
//     const store = {
//       inboundToken: { value: 'INBOUND' },
//       outboundToken: { value: 'OUTBOUND' }
//     };
//     const swapFlowRate = {};
//     const userToken0Flow = { current: { gt: jest.fn(() => false) } };

//     // Act
//     await act(async () => {
//       await swap(
//         signer,
//         chain,
//         provider,
//         store,
//         swapFlowRate,
//         userToken0Flow,
//         setLoading,
//         showToast,
//         setKeyNum
//       );
//     });

//     // Assert
//     expect(setLoading).toHaveBeenCalledWith(true);
//     expect(showToast).toHaveBeenCalledWith(ToastType.ConnectWallet);
//     expect(setLoading).toHaveBeenCalledWith(false);
//   });

//   it('should create a flow if userToken0Flow.current.gt returns false', async () => {
//     // Arrange
//     const signer = {};
//     const chain = { id: 1 };
//     const provider = {};
//     const store = {
//       inboundToken: { value: 'INBOUND' },
//       outboundToken: { value: 'OUTBOUND' }
//     };
//     const swapFlowRate = {};
//     const userToken0Flow = { current: { gt: jest.fn(() => false) } };
//     const superfluid = {
//       cfaV1: {
//         createFlow: jest.fn(() => ({
//           exec: jest.fn(() => Promise.resolve({
//             wait: jest.fn(() => Promise.resolve())
//           }))
//         }))
//       }
//     };
//     Framework.create = jest.fn(() => Promise.resolve(superfluid));
//     getPoolAddress = jest.fn(() => 'POOL_ADDRESS');

//     // Act
//     await act(async () => {
//       await swap(
//         signer,
//         chain,
//         provider,
//         store,
//         swapFlowRate,
//         userToken0Flow,
//         setLoading,
//         showToast,
//         setKeyNum
//       );
//     });

//     // Assert
//     expect(setLoading).toHaveBeenCalledWith(true);
//     expect(
