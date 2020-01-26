import * as React from 'react';
// TODO: Convert to an import after CSRFForm is converted to .tsx
const CSRFForm: any = require('./CSRFForm.js');
import CubeContext from './CubeContext';
import { CustomFormat } from '../../types';
// TODO: Convert to an import after TextEntry is converted to .tsx
const TextEntry: any = require('./TextEntry');

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';

interface CustomDraftFormatModalProps {
  isOpen: boolean;
  toggle: (event: React.MouseEvent<HTMLElement>) => void;
  formatIndex: number;
  format: CustomFormat;
  setFormat: (format: CustomFormat) => void;
}

const CustomDraftFormatModal: React.FC<CustomDraftFormatModalProps> = ({
  isOpen,
  toggle,
  formatIndex,
  format,
  setFormat,
}) => {
  const { cubeID }: { cubeID: string } = React.useContext(CubeContext);
  const formRef = React.useRef<HTMLFormElement>();
  const packs = format.packs || [['']];
  const description = format.html || '';

  const handleChangeDescription = React.useCallback((event: React.FormEvent<HTMLInputElement>): void => {
    const newFormat: CustomFormat = {
      ...format,
      html: event.currentTarget.value,
    };
    setFormat(newFormat);
  }, []);

  const handleAddCard = React.useCallback((event: React.FormEvent<HTMLInputElement>): void => {
    const index: number = parseInt(event.currentTarget.getAttribute('data-index'));
    const newFormat: CustomFormat = { ...format };
    newFormat.packs = [...(newFormat.packs || [['']])];
    newFormat.packs[index] = [...newFormat.packs[index], ''];
    setFormat(newFormat);
  }, []);

  const handleRemoveCard = React.useCallback((event: React.FormEvent<HTMLInputElement>): void => {
    const packIndex: number = parseInt(event.currentTarget.getAttribute('data-pack'));
    const index = parseInt(event.currentTarget.getAttribute('data-index'));

    // don't remove the last card from a pack
    if (format.packs[packIndex].length <= 1) {
      setFormat(format);
    } else {
      const newFormat: CustomFormat = { ...format };
      newFormat.packs = [...(newFormat.packs || [['']])];
      newFormat.packs[packIndex] = [...newFormat.packs[packIndex]];
      newFormat.packs[packIndex].splice(index, 1);
    }
  }, []);

  const handleChangeCard = React.useCallback((event: React.FormEvent<HTMLInputElement>): void => {
    const packIndex: number = parseInt(event.currentTarget.getAttribute('data-pack'));
    const index: number = parseInt(event.currentTarget.getAttribute('data-index'));
    const newFormat: CustomFormat = { ...format };
    newFormat.packs = [...(newFormat.packs || [['']])];
    newFormat.packs[packIndex] = [...newFormat.packs[packIndex]];
    newFormat.packs[packIndex][index] = event.currentTarget.value;
    setFormat(newFormat);
  }, []);

  const handleAddPack = React.useCallback((): void => {
    const newFormat: CustomFormat = { packs, ...format };
    newFormat.packs = [...(packs || [['']]), ['']];
    setFormat(newFormat);
  }, []);

  const handleDuplicatePack = React.useCallback((event: React.FormEvent<HTMLInputElement>): void => {
    const index: number = parseInt(event.currentTarget.getAttribute('data-index'));
    const newFormat: CustomFormat = { ...format };
    newFormat.packs = [...(newFormat.packs || [['']])];
    newFormat.packs.splice(index, 0, newFormat.packs[index]);
    setFormat(newFormat);
  }, []);

  const handleRemovePack = React.useCallback((event: React.FormEvent<HTMLInputElement>): void => {
    const removeIndex: number = parseInt(event.currentTarget.getAttribute('data-index'));
    const newFormat: CustomFormat = { packs, ...format };
    newFormat.packs = (packs || [['']]).filter((_, index) => index !== removeIndex);
    setFormat(newFormat);
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={toggle} labelledBy="customDraftFormatTitle" size="lg">
      <CSRFForm method="POST" action={`/cube/format/add/${cubeID}`} innerRef={formRef}>
        <ModalHeader id="customDraftFormatTitle" toggle={toggle}>
          Create Custom Draft Format
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col className="mt-2">
              <Input type="text" maxLength={200} name="title" placeholder="Title" defaultValue={format.title} />
            </Col>
            <Col>
              <FormGroup tag="fieldset">
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="multiples" value="false" defaultChecked={!format.multiples} /> Don't allow
                    more than one of each card in draft
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="multiples" value="true" defaultChecked={format.multiples} /> Allow
                    multiples (e.g. set draft)
                  </Label>
                </FormGroup>
              </FormGroup>
            </Col>
          </Row>
          <h6>Description</h6>
          <TextEntry name="html" value={description} onChange={handleChangeDescription} />
          <FormText className="mt-3 mb-1">
            Card values can either be single tags or filter parameters or a comma separated list to create a ratio (e.g.
            3:1 rare to mythic could be <code>rarity:rare, rarity:rare, rarity:rare, rarity:mythic</code>). Tags can be
            specified <code>tag:yourtagname</code> or simply <code>yourtagname</code>. <code>*</code> can be used to
            match any card.
          </FormText>
          {packs.map((pack, index) => (
            <Card key={index} className="mb-3">
              <CardHeader>
                <CardTitle className="mb-0">
                  Pack {index + 1} - {pack.length} Cards
                  <Button close onClick={handleRemovePack} data-index={index} />
                </CardTitle>
              </CardHeader>
              <CardBody>
                {pack.map((card, cardIndex) => (
                  <InputGroup key={cardIndex} className={cardIndex !== 0 ? 'mt-3' : undefined}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{cardIndex + 1}</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      value={card}
                      onChange={handleChangeCard}
                      data-pack={index}
                      data-index={cardIndex}
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        color="secondary"
                        outline
                        onClick={handleRemoveCard}
                        data-pack={index}
                        data-index={cardIndex}
                      >
                        Remove
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                ))}
              </CardBody>
              <CardFooter>
                <Button className="mr-2" color="success" onClick={handleAddCard} data-index={index}>
                  Add Card Slot
                </Button>
                <Button color="success" onClick={handleDuplicatePack} data-index={index}>
                  Duplicate Pack
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Button color="success" onClick={handleAddPack}>
            Add Pack
          </Button>
        </ModalBody>
        <ModalFooter>
          <Input type="hidden" name="format" value={JSON.stringify(packs)} />
          <Input type="hidden" name="id" value={formatIndex} />
          <Button color="success" type="submit">
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </CSRFForm>
    </Modal>
  );
};

export default CustomDraftFormatModal;
