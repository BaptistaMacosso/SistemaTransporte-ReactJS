import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
    gap: 10px;
`;

export const Content = styled.div`
    gap: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 1px 2px #0003;
    max-width: 350px;
    padding: 20px;
    border-radius: 5px;
`;

export const Label = styled.label`
    font-size: 18px;
    font-weight: 600;
    color: #676767;
`;

export const LabelSignup = styled.label`
    font-size: 16px;
    color: #676767;
`;

export const LabelError = styled.label`
    font-size: 16px;
    color: red;
`;

export const Strong = styled.label`
    cursor: pointer;
    a{
        text-decoration: none;
        color: #676767;
    }
`;