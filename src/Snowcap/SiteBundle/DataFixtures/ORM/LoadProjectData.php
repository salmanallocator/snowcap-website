<?php
namespace Snowcap\SiteBundle\DataFixtures\ORM;

use Doctrine\Common\CommonException as DoctrineException;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Symfony\Component\DependencyInjection\Container;
use Snowcap\SiteBundle\Entity\Project;
use Snowcap\SiteBundle\Entity\Tag;

use \Symfony\Component\Yaml\Yaml;

class LoadProjectData implements FixtureInterface {
    protected $entities = array();
    protected function createEntity($manager, $entity, $entityIdentifier, array $values)
    {
        /* Populate entity fields */
        foreach($values as $key => $value) {
            if($key === "tags") {
                $newvalue = array();
                foreach($value as $tagName) {
                    $associatedEntity = $manager->getRepository('Snowcap\SiteBundle\Entity\Tag')->findOneByName($tagName);
                    if(!$associatedEntity){
                        $associatedEntity = new Tag();
                        $associatedEntity->setName($tagName);
                        $manager->persist($associatedEntity);
                        $manager->flush();
                    }
                    $newvalue[] = $associatedEntity;
                }
                call_user_func(array($entity, 'set' . Container::camelize($key)), $newvalue);
            } elseif(!is_array($value)){
                if(strpos($value, '@', 0) !== false){
                    $associatedIdentifier = substr($value, 1);
                    if(!array_key_exists($associatedIdentifier, $this->entities)){
                        throw new DoctrineException(sprintf('Trying to reference non-existing fixture entity "%s" for entity "%s"', $associatedIdentifier, $entityIdentifier));
                    }
                    $value = $this->entities[$associatedIdentifier];
                }
                elseif(strtotime($value)) {
                    $value = new \DateTime($value);
                }
                else{
                    $value = $this->decodeMarkdown($value);
                }
                call_user_func(array($entity, 'set' . Container::camelize($key)), $value);
            }
        }
        if(array_key_exists($entityIdentifier, $this->entities)){
            throw new DoctrineException(sprintf('The fixture identifier "%s" is already used', $entityIdentifier));
        }
        $this->entities[$entityIdentifier] = $entity;

        $manager->persist($entity);
    }

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param object $manager
     */
    public function load($manager)
    {
        $agencies = Yaml::parse(__DIR__ . '/agencies.yml');
        foreach($agencies as $agencyIdentifier => $agencyData) {
            $agency = new \Snowcap\SiteBundle\Entity\Agency();
            $this->createEntity($manager, $agency, $agencyIdentifier, $agencyData);
        }

        $images = Yaml::parse(__DIR__ . '/images.yml');
        foreach($images as $imageIdentifier => $imageData) {
            $image = new \Snowcap\SiteBundle\Entity\Image();
            $this->createEntity($manager, $image, $imageIdentifier, $imageData);
        }

        $records = Yaml::parse(__DIR__ . '/projects.yml');
        foreach($records as $recordIdentifier => $recordData) {
            $record = new Project();
            $this->createEntity($manager, $record, $recordIdentifier, $recordData);
        }
        $manager->flush();
    }

    public function decodeMarkdown($string)
    {
        return preg_replace('/(?<=^|%)%/m', '#', $string);
    }

}
