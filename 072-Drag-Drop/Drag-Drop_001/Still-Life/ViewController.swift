//
//  ViewController.swift
//  Still-Life
//
//  Created by Patrick Burke on 2018-03-18.
//  Copyright © 2018 Patrick Burke. All rights reserved.
//

import UIKit
import SceneKit
import ARKit
import VideoToolbox

// Class is "ViewController"
// Inherits from "UIViewController", etc.
class ViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate
{

    // "@IBOutlet" allows the use of outlets and actions in Swift to connect the source code to interface objects
    // "sceneView" is an instance of the "ARSCNView" class
    // "!" is an implicitly unwrapped optional
    @IBOutlet var sceneView: ARSCNView!
    
    // Function inherited from UIKit
    // "Override" inherited characteristics to perform additional initializations
    override func viewDidLoad()
    {
        super.viewDidLoad()
        
        // Set the view's delegate
        // Enables a class or struc to hand off some of its responsibilities to an instance of another type
        sceneView.delegate = self
        
        // Set the session's delegate
        sceneView.session.delegate = self
        
        // Show statistics such as fps and timing information
        sceneView.showsStatistics = false
        
        // Create a new scene
        // 3D SceneKit view
        let scene = SCNScene()
        
        // Set the scene to the view
        sceneView.scene = scene
        
        // use tapping to add and remove photos
        let tapGesture = UITapGestureRecognizer(target: self, action:
            #selector(ViewController.handleTap(gestureRecognize:)))
        view.addGestureRecognizer(tapGesture)
        
        // use pressing to move them
        let panGesture = UIPanGestureRecognizer(
            target: self,
            action: #selector(ViewController.handlePan(gestureRecognize:))
        )
        view.addGestureRecognizer(panGesture)
        
    }
    
    // MARK: - Interactions
    
    // Makes func available to Objective-C
    // "handleTap" is the function
    // "gestureRecognize" is the parameter name
    // "UITapGestureRecognizer" is the parameter type
    // Function doesn't return anything
    @objc
    func handleTap(gestureRecognize: UITapGestureRecognizer){
        
        // where did the user tap, relative to the AR scene?
        let tapLocation = gestureRecognize.location(in: sceneView)
        
        // check if it hit any nodes
        let hitTestResults = sceneView.hitTest(tapLocation)
        // upwrap the first node
        guard let node = hitTestResults.first?.node else {
            // if there are no nodes, add an image
            addImageToScene(mode: "camera")
            return
        }
        // otherwise, remove it
        node.removeFromParentNode()
    }
    
    var objectToMove : SCNNode?
    var zDepth : Float?
    var pressStartPosition : CGPoint?
    var pressEndPosition : CGPoint?
    
    @objc
    func handlePan(gestureRecognize: UITapGestureRecognizer){
        
        if gestureRecognize.state == .began {
            print("pan start")
        
            // where did the user tap, relative to the AR scene?
            let touchLocation = gestureRecognize.location(in: sceneView)
            
            // check if it hit any nodes
            let hitTestResults = sceneView.hitTest(touchLocation)
            // upwrap the first node
            guard let node = hitTestResults.first?.node else {
                print("no nodes there...")
                // if there are no nodes, do nothing
                return
            }
            // otherwise, let's move it!
            objectToMove = node
            zDepth = sceneView.projectPoint(node.position).z
            pressStartPosition = touchLocation
        }
        else if gestureRecognize.state == .ended || gestureRecognize.state == .changed {
            guard let node = objectToMove else {
                print("no node associated for moving...")
                return
            }
            
            // where did the user tap, relative to the AR scene?
            let touchLocation = gestureRecognize.location(in: sceneView)
            
            let newPostion = SCNVector3(
                x: Float(touchLocation.x),
                y: Float(touchLocation.y),
                z: zDepth!
            )
            node.position = sceneView.unprojectPoint(newPostion)
        }
    }
    
    
    // MARK: - Nodes
    
    func addImageToScene(mode: String) {
        guard let currentARFrame = sceneView.session.currentFrame else {
            return
        }
        
        // Create an image plane using a snapshot of the view
        let imagePlane = SCNPlane(width: sceneView.bounds.width / 2500,
                                  height: sceneView.bounds.height / 2500)
        imagePlane.firstMaterial?.lightingModel = .constant
        
        if mode == "camera" {
            // use just the camera stream as the image
            let buffer = currentARFrame.capturedImage
            var cgImage: CGImage?
            VTCreateCGImageFromCVPixelBuffer(buffer, nil, &cgImage)
            
            imagePlane.firstMaterial?.diffuse.contents = cgImage
        } else if mode == "scene" {
            // use the AR scene as the image, compounding any existing nodes
            imagePlane.firstMaterial?.diffuse.contents = sceneView.snapshot()
        }
        
        // Create a plane node and add it to the scene
        let planeNode = SCNNode()
        planeNode.geometry = imagePlane
        sceneView.scene.rootNode.addChildNode(planeNode)
        
        // Set transform of node to be 10cm in front of camera
        var translation = matrix_identity_float4x4
        translation.columns.3.z = -0.15
        planeNode.simdTransform = matrix_multiply(currentARFrame.camera.transform, translation)
    }
    
    
    
    // MARK: - View Initializations and Handlers
    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillAppear(_ animated: Bool)
    {
        super.viewWillAppear(animated)
        
        // Create a session configuration
        let configuration = ARWorldTrackingConfiguration()

        // Run the view's session
        sceneView.session.run(configuration)
    }
    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillDisappear(_ animated: Bool)
    {
        super.viewWillDisappear(animated)
        
        // Pause the view's session
        sceneView.session.pause()
    }
    
    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
        // Release any cached data, images, etc that aren't in use.
    }


    // MARK: - ARSCNViewDelegate
    
    func session(_ session: ARSession, didFailWithError error: Error)
    {
        // Present an error message to the user
        
    }
    
    func sessionWasInterrupted(_ session: ARSession)
    {
        // Inform the user that the session has been interrupted, for example, by presenting an overlay
        
    }
    
    func sessionInterruptionEnded(_ session: ARSession)
    {
        // Reset tracking and/or remove existing anchors if consistent tracking is required
        
    }
}
